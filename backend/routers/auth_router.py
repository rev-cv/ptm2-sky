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

SECRET_KEY = "your_jwt_secret_key"  # Замените на безопасный ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str) -> dict:
    """
    Проверяет JWT-токен и возвращает декодированные данные.
    
    Args:
        token (str): JWT-токен для проверки.
    
    Returns:
        dict: Декодированные данные токена (например, {"sub": "user@example.com"}).
    
    Raises:
        HTTPException: Если токен отсутствует, недействителен или истёк.
    """
    if not token:
        raise HTTPException(status_code=401, detail="Токен отсутствует 434")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Недействительный токен")


@router.post("/register")
async def register(user: UserRegister, response: Response, db:Session = Depends(get_db)):

    # проверки и создание пользователя
    if db.query(exists().where(User.email == user.email)).scalar():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    
    if not db.query(Role).first():
        db.add_all([
            Role(name="admin", permissions='{"can_manage_users": true}'),
            Role(name="premium", permissions='{"can_manage_users": true}'),
            Role(name="user", permissions='{"can_send_messages": true}'),
            Role(name="banned", permissions='{"can_send_messages": true}')
        ])
        db.commit()

    new_user = User(
        email= user.email,
        password_hash = pwd_context.hash(user.password), # хеш пароль
        role=db.query(Role).filter(Role.name == "user").first()
    )

    new_profile = UserProfile(
        full_name=user.name,
        user=new_user 
    )

    db.add(new_user)
    db.add(new_profile)
    db.commit()

    # создание JWT
    access_token = create_access_token(data={"sub": user.email})

    # установка JWT в HttpOnly cookie
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=False,  # secure=True нужен для SameSite=None
        samesite="lax",  # <= это важно
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )

    return {"success": True}


@router.get("/check-token")
async def check_token(request: Request, db:Session = Depends(get_db)):
    token = request.cookies.get("token")

    print(request.cookies)
    
    payload = verify_access_token(token)

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Недействительный токен: отсутствует email")
    
    user_exists = db.query(exists().where(User.email == email)).scalar()
    if not user_exists:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return {"valid": True, "user": email}
