class Point:
    def __init__(self, point_doc):
        self.id = point_doc['_id']
        self.user = point_doc['user']
        self.target = point_doc['target']
        self.active = point_doc['active']
        self.updatedAt = point_doc['updatedAt']

    def get_point(self):
        return {
            "_id": str(self.id),
            "user": str(self.user),
            "target": str(self.target),
            "active": self.active,
            "updatedAt": self.updatedAt
        }


class Post:
    def __init__(self, post_doc):
        self.id = post_doc['_id']
        self.title = post_doc['title']
        self.body = post_doc['body']
        self.points = post_doc['points']
        self.user = post_doc['user']
        self.sub = post_doc['sub']
        self.createdAt = post_doc['createdAt']

    def get_post(self):
        return {
            "_id": str(self.id),
            "title": self.title,
            "body": self.body,
            "points": self.points,
            "user": str(self.user),
            "sub": str(self.sub),
            "createdAt": self.createdAt
        }


class Comment:
    def __init__(self, comment_doc):
        self.id = comment_doc['_id']
        self.body = comment_doc['body']
        self.user = comment_doc['user']
        self.post = comment_doc['post']
        self.parent = comment_doc['parent']
        self.root = comment_doc['root']
        self.points = comment_doc['points']
        self.createdAt = comment_doc['createdAt']

    def get_comment(self):
        return {
            '_id': str(self.id),
            'body': self.body,
            'user': str(self.user),
            'post': str(self.post),
            'parent': str(self.parent),
            'root': str(self.root),
            'points': self.points,
            'createdAt': self.createdAt
        }
