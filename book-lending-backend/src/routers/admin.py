from typing import Generator, Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import uvicorn
from fastapi import APIRouter, Path, HTTPException, Depends
from starlette import status
from models import Books
from database import SessionLocal
from .auth import get_current_user


router = APIRouter(
    prefix='/admin',
    tags=['admin']
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


user_dependency = Annotated[dict, Depends(get_current_user)]
db_dependency = Annotated[dict, Depends(get_db)]

@router.get("/todo",status_code=status.HTTP_200_OK)
async def read_all(user:user_dependency, db:db_dependency):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail='Authentication Failed')
    return db.query(Books).all()

@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book_by_id(book_id: int = Path(gt=0), db: Session = Depends(get_db),user: dict = Depends(get_current_user)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail='Authentication Failed')
    book_model = db.query(Books).filter(Books.id == book_id).filter(user.get('id') == Books.owner_id).first()
    if book_model is None:
        raise HTTPException(status_code=404, detail='Item not found')
    db.query(Books).filter(Books.id == book_id).delete()
    db.commit()
