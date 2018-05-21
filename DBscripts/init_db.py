import sqlite3 as st
from sqlalchemy import create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# conn = st.connect('../firstDB.db', timeout=10)
# conn.close()

from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = 'users'

    userid = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    nickname = Column(String)
    password = Column(String, nullable=False)

    def __repr__(self):
        return "<User(username='%s', nickname='%s', password='%s')>" % (
                 self.username, self.nickname, self.password)

class Comment(Base):
    __tablename__ = 'comments'

    commentid = Column(Integer, primary_key=True)
    username = Column(String)
    createddate = Column(String)
    content = Column(String)

    def __repr__(self):
        return "<Comment(username='%s', createddate='%s', content='%s')>" % (
                 self.username, self.createddate, self.content)

def main():
    engine = create_engine('sqlite:///../firstDB.db')
    Base.metadata.create_all(engine)

if __name__ == '__main__':
    main()