class Point:
    def __init__(self, pointDoc):
        self.id = pointDoc['_id']
        self.user = pointDoc['user']
        self.target = pointDoc['target']
        self.active = pointDoc['active']
        self.updatedAt = pointDoc['updatedAt']

    def get_point(self):
        return {
            "_id": str(self.id),
            "user": str(self.user),
            "target": str(self.target),
            "active": self.active,
            "updatedAt": self.updatedAt
        }
