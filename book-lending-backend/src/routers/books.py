from typing import Generator
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import uvicorn
from fastapi import APIRouter, Path, HTTPException, Depends
from starlette import status
from models import Books
from database import SessionLocal


router = APIRouter()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class BookRequest(BaseModel):
    title: str = Field(min_length=3)
    author: str = Field(min_length=1)
    description: str = Field(min_length=1, max_length=100)
    rating: int = Field(gt=0, lt=6)
    published_year: int = Field(gt=1999, lt=2090)

    class Config:
        schema_extra = {
            'example': {
                'title': 'A new book',
                'author': 'codingwithdipika',
                'description': 'A new description of a book',
                'rating': 5,
                'published_year': 2029
            }
        }


@router.get("/books", status_code=status.HTTP_200_OK)
async def read_all(db: Session = Depends(get_db)):
    books = db.query(Books).all()
    print(books)
    return books


@router.get("/books/{book_id}", status_code=status.HTTP_200_OK)
async def read_book(db: Session = Depends(get_db), book_id: int = Path(gt=0)):
    book_model = db.query(Books).filter(Books.id == book_id).first()
    if book_model is not None:
        return book_model
    raise HTTPException(status_code=404, detail='Item not found')


@router.post("/create-book", status_code=status.HTTP_201_CREATED)
async def create_book(book_request: BookRequest, db: Session = Depends(get_db)):
    book_model = Books(**book_request.model_dump())
    db.add(book_model)
    db.commit()


@router.put("/books/update_book/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_book(book_req: BookRequest, book_id: int = Path(gt=0), db: Session = Depends(get_db)):
    book_model = db.query(Books).filter(Books.id == book_id).first()
    if book_model is None:
        raise HTTPException(status_code=404, detail='Item not found')

    book_model.title = book_req.title
    book_model.description = book_req.description
    book_model.author = book_req.author
    book_model.rating = book_req.rating
    book_model.published_year = book_req.published_year
    db.add(book_model)
    db.commit()


@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book_by_id(book_id: int = Path(gt=0), db: Session = Depends(get_db)):
    book_model = db.query(Books).filter(Books.id == book_id).first()
    if book_model is None:
        raise HTTPException(status_code=404, detail='Item not found')
    db.query(Books).filter(Books.id == book_id).delete()
    db.commit()


if __name__ == "__main__":
    uvicorn.run(router, port=8000, host="0.0.0.0")
