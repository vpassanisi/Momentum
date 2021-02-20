package handlers_posts

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type postsReq struct {
	Sub   string `json:"sub"`
	By    string `json:"by"`
	Order int8   `json:"order"`
}

type postReq struct {
	ID string `json:"ID"`
}

type post struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	User      primitive.ObjectID `json:"user"`
	Points    int32              `json:"points"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}
