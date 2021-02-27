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

type postReq struct {
	PostID string `json:"postID"`
}

type post struct {
	ID          primitive.ObjectID            `bson:"_id,omitempty" json:"_id,omitempty"`
	Title       string                        `json:"title"`
	Body        string                        `json:"body"`
	User        user                          `json:"user"`
	Points      int32                         `json:"points"`
	Sub         primitive.ObjectID            `json:"sub"`
	CreatedAt   int64                         `json:"createdAt"`
	CommentsMap map[string][]commentPopulated `json:"commentsMap"`
	TargetIDs   []string                      `json:"targetIDs"`
}

type user struct {
	ID        primitive.ObjectID `bson:"-" json:"-"`
	Name      string             `json:"name"`
	Email     string             `json:"-"`
	Password  string             `json:"-"`
	CreatedAt int64              `json:"-"`
	UpdatedAt int64              `json:"-"`
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
	Comments  []commentPopulated `json:"comments"`
}
