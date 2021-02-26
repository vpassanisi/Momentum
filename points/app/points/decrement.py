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

decrement = Blueprint('decrement', __name__, url_prefix='/decrement')


@decrement.route("", methods=['POST'])
@expects_json(schema)
def index():
    token = request.json['token']

    if 'postID' in request.json:
        target_id = ObjectId(request.json['postID'])
        collection = "Posts"
    elif 'commentID' in request.json:
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

    # if the point document doesn't exist, make one and decrement the target
    if point_doc == None:
        doc = {"user": user_id, "target": target_id,
               "active": False, 'updatedAt': int(time.time())}
        insert_res = mongo.db.Points.insert_one(doc)

        update_res = mongo.db[collection].find_one_and_update(
            {'_id': target_id}, {'$inc': {'points': -1}}, return_document=ReturnDocument.AFTER)

        if collection == "Posts":
            x = Post(update_res)
            post = x.get_post()
        if collection == "Comments":
            x = Comment(update_res)
            comment = x.get_comment()

        return {'post': post, 'comment': comment}

    # check if the point is already false
    p = Point(point_doc)

    if not p.active:
        return "point is already not active", 400

    # update point document and decrement the target
    update_res = mongo.db.Points.update_one(
        {'_id': p.id}, {'$set': {'active': False}})

    update_res = mongo.db[collection].find_one_and_update(
        {'_id': target_id}, {'$inc': {'points': -2}}, return_document=ReturnDocument.AFTER)

    if collection == "Posts":
        x = Post(update_res)
        post = x.get_post()
    if collection == "Comments":
        x = Comment(update_res)
        comment = x.get_comment()

    return {'post': post, 'comment': comment}
