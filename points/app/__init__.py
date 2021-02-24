from flask import (Flask, make_response)
from flask_pymongo import PyMongo
from flask_expects_json import ValidationError
import os

app = Flask(__name__)

app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

mongo = PyMongo(app)

from app.points.get_points import get_points
from app.points.increment import increment
from app.points.decrement import decrement
from app.points.remove import remove


@app.errorhandler(400)
def bad_request(error):
    if isinstance(error.description, ValidationError):
        return "invalid request body", 400
    # handle other "Bad Request"-errors
    return error


@app.errorhandler(404)
def not_found(error):
    return "resource not found", 404

@app.errorhandler(405)
def not_allowed(error):
    return 'method not allowed', 405


app.register_blueprint(get_points)
app.register_blueprint(increment)
app.register_blueprint(decrement)
app.register_blueprint(remove)
