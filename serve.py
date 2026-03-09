import http.server
import os

os.chdir("/Users/ivanvilaplanamorote/Documents/Claude/Investments")

handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(("", 3456), handler)
print("Serving on http://localhost:3456")
httpd.serve_forever()
