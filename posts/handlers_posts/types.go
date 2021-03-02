package handlers_posts

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type postsReq struct {
	Sub    string `json:"sub"`
	By     string `json:"sortBy"`
	Order  int8   `json:"order"`
	PostID string `json:"postID"`
}

type addPostReq struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	SubID string `json:"subID"`
	Token string `json:"token"`
}

type addPost struct {
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	Points    int64              `json:"points"`
	User      primitive.ObjectID `json:"user"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type post struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	User      user               `json:"user"`
	Points    int32              `json:"points"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type user struct {
	ID        primitive.ObjectID `bson:"-" json:"-"`
	Name      string             `json:"name"`
	Email     string             `json:"-"`
	Password  string             `json:"-"`
	CreatedAt int64              `json:"-"`
	UpdatedAt int64              `json:"-"`
}

type meRes struct {
	ID        string `bson:"_id,omitempty" json:"_id,omitempty"`
	Name      string `json:"name"`
	Email     string `json:"-"`
	CreatedAt int64  `json:"createdAt"`
}
