import os, sys
import socket
import errno

LineDelimiter = "\r\n"
Delimiter = "\r\n\r\n"
Debug = True

def dprint(string):
    if Debug:
        print(string)

class WebServer(object):
    def __init__(self, host="127.0.0.1", port=9090):
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

    def server_forever(self):
        self.sock.listen(100)
        while True:
            self.csock, self.caddr = self.sock.accept()
            header = self.get_request_header()
            print(header)
            self.parse_header(header)
            response = self.build_response("helloworld")
            self.csock.sendall(response)
            self.csock.close()

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
        method, url, version = first_line.split(' ')
        self.method = method.strip().lower()
        self.url = url.strip().lower()
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
        lines = [first_line, ]
        for key in header_info:
            lines.append(key + ': ' + header_info[key])
        header = LineDelimiter.join(lines)
        response = header + Delimiter + data

        return response.encode()

def main():
    server = WebServer()
    server.server_forever()

if __name__ == '__main__':
    main()