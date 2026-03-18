from flask import Flask
from endpoints import api_bp


app = Flask(__name__)


app.register_blueprint(api_bp)


@app.get("/")
def read_root():
    with open("pages/index.html", "r") as f:
        return f.read()
