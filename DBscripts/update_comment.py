import json

from DBscripts.init_db import User, Comment
# from init_db import User, Comment

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def connect_db():
    # engine = create_engine('sqlite:///../firstDB.db')
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
    querys = {}
    if data != '':
        querys = json.loads(data)
    print(querys)

    try:
        session = connect_db()
        
        if ('action' in querys and querys['action'] == 'add'):
            username = querys['username']
            content = querys['content']
            createddate = querys['time']

            new_comment = Comment(username=username, content=content, createddate=createddate)
            print('prepare to add comment')
            session.add(new_comment)
            session.commit()
            print('added comment to db')

        print('prepare to query')
        comments = session.query(Comment).order_by(Comment.createddate.desc()).limit(7).all()
        print(comments)        
        session.close()

    except:
        return [], 'Failed'

    comment_data = []
    for comment in comments:
        comment_data.append({
            'author': comment.username,
            'time': comment.createddate,
            'content': comment.content
        })

    return [], json.dumps(comment_data)

def main():
    result = execute({'data': 'username=user1&time=2018&content=Hello'})
    print(result[1])
    result = execute({'data': ''})
    print(result[1])

if __name__ == '__main__':
    main()