import os
import time
import datetime
from pathlib import Path

from flask import Flask, request, make_response, jsonify

from flask.wrappers import Response

app = Flask(__name__)

# limit upload file size is 10MB
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

DIR = './tmp'

@app.route('/')
def hello():
    name = "Hello World"
    return name

@app.route('/good')
def good():
    name = "Good"
    return name

@app.route('/api/health')
def health():
    return Response(status=200)


@app.route('/api/database')
def create_database():
    pass

@app.route('/api/instance')
def create_instance():
    pass


if __name__ == "__main__":
    app.run(debug=True,  host='0.0.0.0', port=8080)
