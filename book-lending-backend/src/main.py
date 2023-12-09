import uvicorn
from fastapi import FastAPI
import models
from database import engine
from routers import auth, books, admin, users

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router, tags=['auth'])
app.include_router(books.router)
app.include_router(admin.router)
app.include_router(users.router)

if __name__ == "__main__":
    uvicorn.run(app, port=8000, host="0.0.0.0")
