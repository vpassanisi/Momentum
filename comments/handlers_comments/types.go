package handlers_comments

import "go.mongodb.org/mongo-driver/bson/primitive"

type commentsReq struct {
	PostID        string `json:"postID"`
	Order         int8   `json:"order"`
	By            string `json:"by"`
	LastValue     int64  `json:"lastValue"`
	LastCreatedAt int64  `json:"lastCreatedAt"`
}

type commentsMapReq struct {
	PostID    string `json:"postID"`
	SortBy    string `json:"sortBy"`
	Order     int8   `json:"order"`
	LastValue int64  `json:"lastValue"`
}

type user struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Name      string             `json:"name"`
	Email     string             `json:"-"`
	Password  string             `json:"-"`
	CreatedAt int64              `json:"createdAt"`
}

type meRes struct {
	ID        string `bson:"_id,omitempty" json:"_id,omitempty"`
	Name      string `json:"name"`
	Email     string `json:"-"`
	CreatedAt int64  `json:"createdAt"`
}

type newComment struct {
	Body      string             `json:"body"`
	Points    int64              `json:"points"`
	User      primitive.ObjectID `json:"user"`
	Post      primitive.ObjectID `json:"post"`
	Parent    primitive.ObjectID `json:"parent"`
	Root      primitive.ObjectID `json:"root"`
	CreatedAt int64              `json:"createdAt"`
}

type commentPopulated struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Body      string             `json:"body"`
	Points    int64              `json:"points"`
	User      user               `json:"user"`
	Post      primitive.ObjectID `json:"post"`
	Parent    primitive.ObjectID `json:"parent"`
	Root      primitive.ObjectID `json:"root"`
	CreatedAt int64              `json:"createdAt"`
}

type newCommentReq struct {
	PostID   string `json:"postID"`
	ParentID string `json:"parentID"`
	RootID   string `json:"rootID"`
	Body     string `json:"body"`
	Token    string `json:"token"`
}
