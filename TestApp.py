import sys, os

from SimpleWebFramework import WebFramework
from SimpleWebServer import WebServer

from DBscripts import init_db
from DBscripts import register, login

def main():
    app = WebFramework()
    # app.router.route('/test.html')
    # app.router.route('/test.js')
    app.router.route('/register', register.execute)
    app.router.route('/login', login.execute)
    app_server = WebServer(app)
    app_server.server_forever()

if __name__ == '__main__':
    main()