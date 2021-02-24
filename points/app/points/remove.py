from flask import (Blueprint, request)
from app import mongo
from flask_expects_json import expects_json
from bson.objectid import ObjectId
from bson.json_util import dumps
from .classes import Point, Post, Comment
import requests
import time
from pymongo import ReturnDocument

schema = {
    'type': 'object',
    'properties': {
        'postID': {'type': 'string'},
        'commentID': {'type': 'string'},
        'token': {'type': 'string'}
    },
    'required': ['token']
}

remove = Blueprint('remove', __name__, url_prefix='/remove')


@remove.route("", methods=['POST'])
@expects_json(schema)
def index():
    token = request.json['token']

    if request.json['postID']:
        target_id = ObjectId(request.json['postID'])
        collection = "Posts"
    elif request.json['commentID']:
        target_id = ObjectId(request.json['commentID'])
        collection = "Comments"

    p = {'token': token}
    r = requests.post('http://users:5000/me', data=p)
    if r.ok:
        res = r.json()
    else:
        return r.text, 400

    user_id = ObjectId(res['_id'])

    comment = {}
    post = {}

    point_doc = mongo.db.Points.find_one(
        {"target": target_id, "user": user_id})

    # if the point document doesn't return error
    if point_doc == None:
        return "point does not exist", 400

    # if point.active = True subtract one from the target else add one to the target
    p = Point(point_doc)

    if p.active:
        update_res = mongo.db[collection].find_one_and_update(
            {'_id': target_id}, {'$inc': {'points': -1}}, return_document=ReturnDocument.AFTER)
    else:
        update_res = mongo.db[collection].find_one_and_update(
            {'_id': target_id}, {'$inc': {'points': 1}}, return_document=ReturnDocument.AFTER)

    if collection == "Posts":
        x = Post(update_res)
        post = x.get_post()
    if collection == "Comments":
        x = Comment(update_res)
        comment = x.get_comment()

    # delete the point document
    mongo.db.Points.delete_one({"target": target_id, "user": user_id})

    return {'post': post, 'comment': comment}
