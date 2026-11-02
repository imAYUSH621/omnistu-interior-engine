"""
Local Preview Server for Omnistu Interior Engine
Run: python serve.py [port]
"""

import sys
import os
import http.server
import socketserver
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DIST_DIR = Path(__file__).parent / "dist"

if not DIST_DIR.exists():
    print("Error: dist directory not found. Please run 'npm run build' first.")
    sys.exit(1)

os.chdir(DIST_DIR)

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve index.html for all SPA routes that don't match a static file
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

print(f"==================================================")
print(f"Omnistu Interior Engine Preview Running")
print(f"URL: http://localhost:{PORT}")
print(f"Demo Links:")
print(f"  - Default Studio:    http://localhost:{PORT}/")
print(f"  - Del-Air Florida:   http://localhost:{PORT}/?client=del-air")
print(f"  - Studio Luxe NY:    http://localhost:{PORT}/?client=studio-luxe")
print(f"  - Haven Remodel TX:  http://localhost:{PORT}/?client=haven-remodel")
print(f"==================================================")

with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
