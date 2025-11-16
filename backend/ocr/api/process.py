"""
Vercel Serverless Function for OCR Processing
"""
import sys
import os

# Add parent directory to path to import OCRService
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from http.server import BaseHTTPRequestHandler
import json
from ocrService import OCRService


class handler(BaseHTTPRequestHandler):
    """
    Vercel serverless function handler for OCR processing
    """
    
    def do_POST(self):
        """Handle POST requests for OCR processing"""
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))
            
            # Read request body
            body = self.rfile.read(content_length).decode('utf-8')
            request_data = json.loads(body) if body else {}
            
            # Extract parameters
            uid = request_data.get('uid')
            
            if not uid:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing uid parameter'}).encode())
                return
            
            # Initialize OCR service
            ocr_service = OCRService("medicalDocuments")
            
            # Process OCR
            result = ocr_service.process_latest_medical_report(uid)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
