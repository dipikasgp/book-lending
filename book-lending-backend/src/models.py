from database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    firstname = Column(String, unique=True)
    lastname = Column(String, unique=True)
    hashed_password = Column(String, unique=True)
    is_active = Column(Boolean, default=True)
    role = Column(String)



class Books(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    description = Column(String)
    rating = Column(Integer)
    published_year = Column(Integer)
    owner_id = Column(Integer, ForeignKey('users.id'))
