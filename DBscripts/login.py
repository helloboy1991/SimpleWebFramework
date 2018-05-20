from DBscripts.init_db import User, Comment
# from init_db import User, Comment

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from http import cookies
import os, sys

def connect_db():
    engine = create_engine('sqlite:///firstDB.db')
    session = sessionmaker(bind=engine)()

    return session

def parse_data(data):
    querys = {}
    try:
        items = data.split('&')
        print(items)
        for item in items:
            try:
                key, value = item.split('=')
                key = key.strip()
                value = value.strip()
                querys[key] = value
            except:
                pass
    except:
        pass
    
    return querys

def execute(environ):
    data = environ['data']
    print(data)
    querys = parse_data(data)
    print(querys)
    try:
        username = querys['username']
        password = querys['password']
        session = connect_db()
        print('prepare to query')
        user = session.query(User).filter(User.username==username).one()
        print('query db: ' + str(user))
    except:
        return [], 'Failed'
    
    if user.password == password:
        cookie = cookies.SimpleCookie()
        cookie['username'] = user.username
        cookie['username']['path'] = '/'
        cookie['nickname'] = user.nickname
        cookie['nickname']['path'] = '/'
        set_cookies = cookie.output().split('\r\n')
        header_infos = []
        for set_cookie in set_cookies:
            print(set_cookie)
            key, value = set_cookie.split(':', 1)
            header_infos.append((key, value))
        print('header infos: ' + str(header_infos))
        return header_infos, 'username=%s&nickname=%s' % (user.username, user.nickname)

    return [], 'Failed'

def main():
    cookie = cookies.SimpleCookie()
    cookie['username'] = '123'
    cookie['username']['path'] = '/'
    cookie['nickname'] = 'hello'
    cookie['nickname']['path'] = '/'

    print(cookie.output())
    print(cookie.items())
    print(cookie.keys())
    print(cookie.values())

if __name__ == '__main__':
    main()