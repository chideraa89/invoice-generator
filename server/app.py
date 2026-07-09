import os  # <-- 1. Added missing import
from flask import Flask
from flask_cors import CORS
from models import db


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///invoices.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    from routes import api
    app.register_blueprint(api, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))  # <-- 2. Fixed capitalization to 'port'
    app.run(host="0.0.0.0", port=port)