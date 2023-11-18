FROM python:3.11

WORKDIR /FastAPI

COPY requirements.txt .
COPY ./src ./src

RUN pip install -r requirements.txt

CMD["python","/src/books2.py"]
