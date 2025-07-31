from fastapi import APIRouter, Request, Depends, Body, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import exists
from schemas.types_auth import UserLogin, UserRegister
from database.sqlalchemy_tables import get_db, User, UserProfile, Role
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

SECRET_KEY = "your_jwt_secret_key"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


# === Генерация токенов ===
def create_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# === Регистрация ===
@router.post("/register")
async def register(user: UserRegister, response: Response, db: Session = Depends(get_db)):

    if db.query(exists().where(User.email == user.email)).scalar():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    new_user = User(
        email=user.email,
        password_hash=pwd_context.hash(user.password),
        role=db.query(Role).filter(Role.name == "user").first()
    )

    new_profile = UserProfile(
        full_name=user.name, 
        user=new_user
    )

    db.add(new_user)
    db.add(new_profile)
    db.commit()
    db.refresh(new_user)

    return set_tokens_in_response(response, new_user)


# === Логин ===
@router.post("/login")
async def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    user_with_db = db.query(User).filter(User.email == user.email).first()
    if user_with_db is None or not pwd_context.verify(user.password, user_with_db.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    return set_tokens_in_response(response, user_with_db)


# === Установка токенов в куки ===
def set_tokens_in_response(response: Response, user: User):
    access_token = create_token({"sub": user.email, "id": user.id}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_token({"sub": user.email, "id": user.id}, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # 🔒 True в проде
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/refresh"  # refresh_token отправляется только на этот url
    )

    return {"success": True}


# === Проверка access_token ===
@router.get("/check-token")
async def check_token(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Access Token отсутствует")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Недействительный Access Token")

    email = payload.get("sub")
    if not email or not db.query(exists().where(User.email == email)).scalar():
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    return {"valid": True, "user": email}


# === Обновление access_token через refresh ===
@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    print(token)
    if not token:
        raise HTTPException(status_code=401, detail="Отсутствует Refresh Token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Недействительный Refresh Token")
    
    email = payload.get("sub")
    user_id = payload.get("id")

    if not email or not user_id:
        raise HTTPException(status_code=401, detail="Недействительный Refresh Token")

    new_access_token = create_token({"sub": email, "id": user_id}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=15 * 60,
        path="/"
    )
    return {"valid": True, "user": email}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/api/refresh")
    return {"success": True}
