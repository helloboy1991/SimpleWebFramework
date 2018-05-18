import sys, os

from SimpleWebFramework import WebFramework
from SimpleWebServer import WebServer

def main():
    app = WebFramework()
    # app.router.route('/test.html')
    # app.router.route('/test.js')
    app_server = WebServer(app)
    app_server.server_forever()

if __name__ == '__main__':
    main()