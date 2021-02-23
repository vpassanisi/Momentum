from flask import (Blueprint, jsonify, request)
from app import mongo
from flask_expects_json import expects_json
from bson.objectid import ObjectId
from bson.json_util import dumps
from collections import namedtuple
from .classes import Point
import requests

schema = {
    'type': 'object',
    'properties': {
        'targetIDs': {
            'type': 'array',
            'items': {
                'type': 'string'
            }
        },
        'token': {'type': 'string'}
    },
    'required': ['targetIDs', 'token']
}

get_points = Blueprint('points_mod', __name__, url_prefix='/points')


@get_points.route("", methods=['POST'])
@expects_json(schema)
def index():
    jsonIDs = request.json['targetIDs']
    token = request.json['token']

    p = {'token': token}
    r = requests.post('http://users:5000/me', data=p)
    if r.ok:
        res = r.json()
    else:
        return r.text, 400

    targetIDs = []
    for stringID in jsonIDs:
        targetIDs.append(ObjectId(stringID))

    cursor = mongo.db.Points.find(
        {"target": {'$in': targetIDs}, "user": ObjectId(res['_id'])})

    points = {}
    for pointDoc in cursor:
        p = Point(pointDoc)
        points[str(p.target)] = p.active

    return dumps(points)
