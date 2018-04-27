import os, sys
import socket
import errno

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

    def server_forever(self):
        self.sock.listen(100)
        while True:
            self.csock, self.caddr = self.sock.accept()
            header = self.get_request_header()
            print(header)

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

def main():
    server = WebServer()
    server.server_forever()

if __name__ == '__main__':
    main()