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

increment = Blueprint('increment', __name__, url_prefix='/increment')


@increment.route("", methods=['POST'])
@expects_json(schema)
def index():
    token = request.json['token']

    if request.json['postID']:
        ID = ObjectId(request.json['postID'])
        collection = "Posts"
    elif request.json['commentID']:
        ID = ObjectId(request.json['commentID'])
        collection = "Comments"

    p = {'token': token}
    r = requests.post('http://users:5000/me', data=p)
    if r.ok:
        res = r.json()
    else:
        return r.text, 400

    user = ObjectId(res['_id'])

    comment = {}
    post = {}

    point_doc = mongo.db.Points.find_one(
        {"target": ID, "user": user})

    # if the point document doesn't exist, make one and increment the target
    if point_doc == None:
        doc = {"user": user, "target": ID,
               "active": True, 'updatedAt': int(time.time())}
        insert_res = mongo.db.Points.insert_one(doc)

        update_res = mongo.db[collection].find_one_and_update(
            {'_id': ID}, {'$inc': {'points': 1}}, return_document=ReturnDocument.AFTER)

        if collection == "Posts":
            x = Post(update_res)
            post = x.get_post()
        if collection == "Comments":
            x = Comment(update_res)
            comment = x.get_comment()

        return {'post': post, 'comment': comment}

    # check if the point is already active
    p = Point(point_doc)

    if p.active:
        return "point is already active", 400

    # update point document and increment the target
    update_res = mongo.db.Points.update_one(
        {'_id': p.id}, {'$set': {'active': True}})

    update_res = mongo.db[collection].find_one_and_update(
        {'_id': ID}, {'$inc': {'points': 2}}, return_document=ReturnDocument.AFTER)

    if collection == "Posts":
        x = Post(update_res)
        post = x.get_post()
    if collection == "Comments":
        x = Comment(update_res)
        comment = x.get_comment()

    return {'post': post, 'comment': comment}
