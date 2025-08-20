from fastapi import APIRouter, Request, Depends, Body, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import exists
from schemas.types_auth import UserLogin, UserRegister
from database.sqlalchemy_tables import get_db, User, UserProfile, Role
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES, JWT_REFRESH_TOKEN_EXPIRE_DAYS

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

# === Генерация токенов ===
def create_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


# === Валидация и распаковка токена ===
def unpack_token(token, type_token="a", is_return_id=False):
    tt = 'Refresh' if type_token=='r' else 'Access'

    if not token:
        raise HTTPException(status_code=401, detail=f"Отсутствует {tt} Token")
    
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail=f"Недействительный {tt} Token")
    
    email = payload.get("sub")
    user_id = payload.get("id")

    if not email or not user_id:
        raise HTTPException(status_code=401, detail=f"Недействительный {tt} Token")
    
    return payload if not is_return_id else int(user_id)


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
    access_token = create_token({"sub": user.email, "id": user.id}, timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_token({"sub": user.email, "id": user.id}, timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAYS))

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # 🔒 True в проде
        samesite="lax",
        max_age=JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/refresh"  # refresh_token отправляется только на этот url
    )

    return {"success": True}


# === Проверка access_token ===
@router.get("/check-token")
async def check_token(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    payload = unpack_token(token,"a")
    email = payload.get("sub")
    if not db.query(exists().where(User.email == email)).scalar():
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    return {"valid": True, "user": email}


# === Обновление access_token через refresh ===
@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    payload = unpack_token(token,"r")
    email = payload.get("sub")
    user_id = payload.get("id")
    new_access_token = create_token({"sub": email, "id": user_id}, timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES))
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


# === Генерация специального токена для открытия WebSocket соединения ===
@router.get("/get_ws_token")
async def get_websocket_token(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    payload = unpack_token(token,"a")
    email = payload.get("sub")
    user_id = payload.get("id")
    if not db.query(exists().where(User.email == email)).scalar():
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    new_ws_token = create_token({"sub": email, "id": user_id}, timedelta(seconds=30))
    return {"ws_token": new_ws_token}

