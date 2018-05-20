import os, sys
import socket
import errno
from multiprocessing import Process

LineDelimiter = "\r\n"
Delimiter = "\r\n\r\n"
Debug = True

def dprint(string):
    if Debug:
        print(string)

class WebServer(object):
    def __init__(self, application, host="127.0.0.1", port=9091):
        self.host = host
        self.port = port
        self.addr = (host, port)
        self.sock = socket.socket()
        self.sock.bind(self.addr)
        self.csock = None
        self.request = ''
        self.response = ''
        self.caddr = None
        self.method = None
        self.url = None
        self.version = None
        self.header_info = {}
        self.app = application
        self.environ = {}
        self.request_data = ''

    def server_forever(self):
        self.sock.listen(100)
        while True:
            self.csock, self.caddr = self.sock.accept()
            Process(target = self.handle_connect, args = (self.csock, self.caddr)).start()
            self.csock.close()
    
    def start_response(self, status, header_info):
        first_line = "%s %s" % (self.version, status)
        lines = [first_line, ]
        for header_tuple in header_info:
            lines.append(header_tuple[0]+': '+header_tuple[1])
        header = LineDelimiter.join(lines)+Delimiter
        self.csock.sendall(header.encode('utf-8'))

    def build_environ(self):
        self.environ['method'] = self.method
        self.environ['url'] = self.url
        self.environ['version'] = self.version
        self.environ['header'] = self.header_info
        self.environ['data'] = self.request_data
        self.environ['addr'] = self.caddr

    def handle_connect(self, csock, caddr):
        self.csock = csock
        self.caddr = caddr
        try:
            header = self.get_request_header()
            print(header)
            self.parse_header(header)
            if self.method == 'post':
                self.get_request_data()
            print(self.request_data)
        except:
            pass
        else:
            self.build_environ()
            response_list = self.app(self.environ, self.start_response)
            for response in response_list:
                self.csock.sendall(response)
            self.csock.close()

    def get_request_data(self):
        content_len = int(self.header_info['content-length'])
        try:
            self.request_data = str(self.request).split(Delimiter)[1]
        except:
            pass
        while len(self.request_data) < content_len:
            try:
                recv_buff = self.csock.recv(10240)
                if recv_buff is None or len(recv_buff)==0:
                    break
                self.request_data += recv_buff.decode()
            except Exception as e:
                print(e)
                break
        
        return str(self.request_data)

    def get_request_header(self):
        while not Delimiter in self.request:
            try:
                recv_buff = self.csock.recv(10240)
                if recv_buff is None or len(recv_buff)==0:
                    break
                self.request += recv_buff.decode()
            except Exception as e:
                print(e)
                break

        return str(self.request).split(Delimiter)[0]
    
    def parse_header(self, header):
        lines = header.split(LineDelimiter)
        first_line = lines[0]
        print('first_line: ' + first_line)
        method, url, version = first_line.split(' ')
        self.method = method.strip().lower()
        self.url = url.strip().split('?', 1)[0]
        try:
            self.request_data = url.strip().split('?', 1)[1]
        except:
            pass
        self.url = self.url.strip().lower()
        self.version = version.strip().lower()
        for line in lines[1:]:
            key, value = line.split(':', 1)
            self.header_info[key.strip().lower()] = value.strip().lower()
        print(self.method)
        print(self.url)
        print(self.header_info)
    
    def build_response(self, data, code=200, desc='OK', header_info={}):
        first_line = "%s %d %s" % (self.version, code, desc)
        content_len = len(data)
        header_info['Content-Length'] = str(content_len)
        if 'Content-Type' not in header_info:
            header_info['Content-Type'] = 'text/html; charset=utf-8'
        lines = [first_line, ]
        for key in header_info:
            lines.append(key + ': ' + header_info[key])
        header = LineDelimiter.join(lines)
        response = header + Delimiter + data

        return response.encode()

def simple_app(environ, start_response):
    response_body = 'HelloWorld'.encode('utf-8')
    start_response("200 OK", [('Content-Type', 'text/plain'), ('Content-Length', str(len(response_body)))])

    return [response_body]

def main():
    server = WebServer(simple_app)
    server.server_forever()

if __name__ == '__main__':
    main()