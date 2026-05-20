"""Servidor estatico minimo para Casinos Fortuna (Railway-ready)."""
import os
from pathlib import Path

from flask import Flask, abort, send_from_directory

BASE_DIR = Path(__file__).parent.resolve()

app = Flask(__name__, static_folder=None)


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    requested = (BASE_DIR / filename).resolve()

    if not str(requested).startswith(str(BASE_DIR)):
        abort(404)

    if requested.is_file():
        return send_from_directory(BASE_DIR, filename)

    html_candidate = (BASE_DIR / f"{filename}.html").resolve()
    if html_candidate.is_file() and str(html_candidate).startswith(str(BASE_DIR)):
        return send_from_directory(BASE_DIR, f"{filename}.html")

    abort(404)


@app.errorhandler(404)
def not_found(_error):
    return send_from_directory(BASE_DIR, "index.html"), 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
