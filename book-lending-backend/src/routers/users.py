from typing import Generator, Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import uvicorn
from fastapi import APIRouter, Path, HTTPException, Depends
from passlib.context import CryptContext
from starlette import status
from models import Users
from database import SessionLocal
from .auth import get_current_user

router = APIRouter(
    prefix='/users',
    tags=['users']
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


user_dependency = Annotated[dict, Depends(get_current_user)]
db_dependency = Annotated[dict, Depends(get_db)]
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length=6)


@router.get("/", status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    user_model = db.query(Users).filter(user.get('username') == Users.username).first()
    if user_model is not None:
        return user_model


@router.put("/change_password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(user: user_dependency, db: db_dependency, user_verification: UserVerification):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    user_model = db.query(Users).filter(user.get('username') == Users.username).first()
    if user_model is not None:
        user_model.hashed_password = bcrypt_context.hash(user_verification.new_password)
        db.add(user_model)
        db.commit()
