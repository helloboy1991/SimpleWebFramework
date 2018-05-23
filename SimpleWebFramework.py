import os
import sys

from SimpleWebServer import WebServer

CODE = 'utf-8'

class WebFramework(object):
    def __init__(self):
        self.status = '200 OK'
        self.response_header_info = []
        self.response_body_segments = []
        self.response_data = 'HelloWorld'
        self.router = Router()
        self.is_text = True
    
    def __call__(self, environ, start_response):
        print('call wsgi')
        src_path, callback = self.router.switch(environ['url'])
        
        if src_path is None:
            print('url is invalid')
        elif callback is None:
            print('url is statics')
            text_files_suffix = ['html', 'htm', 'js', 'css']
            try:
                file_type = src_path.split('.')[-1]
                if file_type in text_files_suffix:
                    print('request file is text file')
                    self.response_data = open(src_path, encoding=CODE).read()
                else:
                    self.is_text = False
                    print('request file in not text file')
                    self.response_data = open(src_path, mode='rb').read()
            except Exception as e:
                print(e)
        else:
            print('url is dynamic')
            self.response_header_info, self.response_data = callback(environ)
        
        self.build_response_segment()
        self.build_response_header()

        start_response(self.status, self.response_header_info)
        
        for response_body_segment in self.response_body_segments:
            yield response_body_segment
    
    def build_response_segment(self):
        if self.is_text:
            self.response_body_segments = [self.response_data.encode(CODE)]
        else:
            self.response_body_segments = [self.response_data]

    def build_response_header(self):
        if len(self.response_body_segments) == 1:
            body_len = len(self.response_body_segments[0])
            self.response_header_info.append(('Content-Length', str(body_len)))
            if (self.is_text):
                self.response_header_info.append(('Content-Type', 'text/html; charset=utf-8'))

class Router(object):
    def __init__(self):
        self.route_callbacks = {}
        self.static_routes = []
        self.dynamic_routes = []
        self.all_routes = []
        self.current_route = None
        self._base_path = '.'

        self.route('/statics')
    
    def base_path(self, path_str):
        self._base_path = path_str
        return self._base_path

    def route(self, route_str, callback=None):
        if callback is None:
            self.static_routes.append(route_str)
            print("add new static route")
        else:
            self.dynamic_routes.append(route_str)
            print("add new dynamic route")
        
        self.all_routes.append(route_str)
        self.route_callbacks[route_str] = callback

    def get_full_route(self, route, url_path=None):
        url_path = url_path or route
        if url_path=='/' or url_path=='/index.html':
            return './index.html'

        if self.route_callbacks[route] is None:
            return self._base_path + url_path

        return self._base_path + url_path
    
    def switch(self, url_path):
        route = url_path
        print(route)
        if route == '/':
            return self.get_full_route('/'), None

        if route in self.all_routes:
            return self.get_full_route(route), self.route_callbacks[route]
        
        while len(route) > 1:
            route = '/'.join(route.split('/')[:-1])
            print(route)
            print(self.static_routes)
            if route in self.static_routes:
                print('route found in static')
                return self.get_full_route(route, url_path), None
        
        return None, None

def main():
    app = WebFramework()

    app.router.route('/test.html')
    
    app_server = WebServer(app)
    app_server.server_forever()

if __name__ == '__main__':
    main()