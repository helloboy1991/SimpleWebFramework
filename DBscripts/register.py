from DBscripts.init_db import User, Comment

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

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
        nickname = querys['nickname']
        password = querys['password']
    except:
        return [], 'Failed'
    else:
        try:
            session = connect_db()
            new_user = User(username=username, nickname=nickname, password=password)
            print('prepare to query')
            try:
                existed = session.query(User).filter(User.username==username).one()
                print('query db: ' + str(existed))
            except:
                session.add(new_user)
                session.commit()
                session.close()
            else:
                session.close()
                return [], 'Failed'
        except:
            return [], 'Failed'

    return [], 'OK'

def main():
    execute('username=000, password=123456')
    execute('username=001, password=123456')

if __name__ == '__main__':
    main()