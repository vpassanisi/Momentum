package replies

import "go.mongodb.org/mongo-driver/bson/primitive"

type reply struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Body      string             `json:"body"`
	Points    int64              `json:"points"`
	User      primitive.ObjectID `json:"user"`
	Comment   primitive.ObjectID `json:"comment"`
	Parent    primitive.ObjectID `json:"parent"`
	Post      primitive.ObjectID `json:"post"`
	CreatedAt int64              `json:"createdAt"`
}

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type respondR struct {
	Success bool  `json:"success"`
	Data    reply `json:"data"`
}
