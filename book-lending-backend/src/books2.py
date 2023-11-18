from typing import Optional

from fastapi import FastAPI, Path, Query, HTTPException
from pydantic import BaseModel, Field
import uvicorn

app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this based on your needs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


class Book:
    id: int
    title: str
    author: str
    description: str
    rating: int
    published_date: int

    def __init__(self, id, title, author, description, rating, published_date):
        self.published_date = published_date
        self.id = id
        self.title = title
        self.author = author
        self.description = description
        self.rating = rating


class BookRequest(BaseModel):
    id: Optional[int] = Field(title='ID is not needed')
    title: str = Field(min_length=3)
    author: str = Field(min_length=3)
    description: str = Field(min_length=3, max_length=100)
    rating: int = Field(gt=-1, lt=6)
    published_date: int = Field(gt=1999, lt=2999)

    class Config:
        json_schema_extra = {
            'example': {
                'title': 'A New Book',
                'author': 'codingwithDipika',
                'description': 'A new descroption of the Book',
                'rating': 5,
                'published_date': 2013
            }
        }


BOOKS = [
    Book(1, 'Computer Science Pro', 'codingwithDipika', 'A very nice book', 5, 2012),
    Book(2, 'Be fast with FastAPI', 'codingwithDipika', 'A great book', 5, 2012),
    Book(3, 'Master Endpoints', 'codingwithDipika', 'A very nice book', 5, 2013),
    Book(4, 'HP1', 'Author 1', 'Book description', 4, 2013),
    Book(5, 'HP2', 'Author 2', 'Book description', 3, 2014),
    Book(6, 'HP3', 'Author 3', 'Book description', 2, 2014)
]


@app.get('/books')
async def read_all_books():
    return BOOKS


@app.post('/create_book')
async def create_book(book_request: BookRequest):
    new_book = Book(**book_request.model_dump())
    BOOKS.append(find_book_id(new_book))


def find_book_id(book: Book):
    book.id = 1 if len(BOOKS) == 0 else BOOKS[-1].id + 1
    return book


@app.get('/books/{book_id}')
async def read_book(book_id: int = Path(gt=0)):
    for book in BOOKS:
        if book.id == book_id:
            return book


@app.get('/books/')
async def read_book_by_rating(book_rating: int =Query(gt=0, lt=6)):
    books_to_return = []
    for book in BOOKS:
        if book.rating == book_rating:
            books_to_return.append(book)
    print(books_to_return)
    return books_to_return


@app.put('/books/update_book')
async def update_book(book: BookRequest):
    for i in range(len(BOOKS)):
        if BOOKS[i].id == book.id:
            BOOKS[i] = book


@app.delete('/books/{book_id}')
async def delete_book(book_id: int = Path(gt=0)):
    for i in range(len(BOOKS)):
        if BOOKS[i].id == book_id:
            BOOKS.pop(i)
            break


@app.get('/books/publish/')
async def read_book_by_published_date(published_date: int = Query(gt=1999, lt=2999)):
    books_to_return = []
    for book in BOOKS:
        if book.published_date == published_date:
            books_to_return.append(book)
    print(books_to_return)
    return books_to_return


if __name__ == "__main__":
    uvicorn.run(app, port=8000, host="0.0.0.0")
