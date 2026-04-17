from pathlib import Path

from flask import Flask, send_from_directory
from endpoints import api_bp


DIST_DIR = Path(__file__).parent / "dist"


app = Flask(__name__, static_folder=str(DIST_DIR), static_url_path="")


app.register_blueprint(api_bp)


@app.get("/")
def read_root():
    return app.send_static_file("index.html")


@app.get("/<path:path>")
def serve_spa(path: str):
    asset_path = DIST_DIR / path
    if asset_path.exists() and asset_path.is_file():
        return send_from_directory(DIST_DIR, path)

    return app.send_static_file("index.html")
