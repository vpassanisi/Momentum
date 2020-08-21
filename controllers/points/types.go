package points

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type respondP struct {
	Success bool `json:"success"`
	Data    post `json:"data"`
}

type respondC struct {
	Success bool    `json:"success"`
	Data    comment `json:"data"`
}

type point struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	User      primitive.ObjectID `bson:"-" json:"user"`
	Target    primitive.ObjectID `bson:"-" json:"traget"`
	Active    bool               `bson"active" json:"active"`
	UpdatedAt int64              `bson:"-" json:"updatedAt"`
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

type comment struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Body      string             `json:"body"`
	Points    int64              `json:"points"`
	User      primitive.ObjectID `json:"user"`
	Post      primitive.ObjectID `json:"post"`
	Parent    primitive.ObjectID `json:"parent"`
	CreatedAt int64              `json:"createdAt"`
}

type ids struct {
	IDs []string `json:"ids"`
}
