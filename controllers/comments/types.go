package comments

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type user struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Name      string             `json:"name"`
	Email     string             `json:"-"`
	Password  string             `json:"-"`
	CreatedAt int64              `json:"createdAt"`
}

type post struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	Points    int32              `json:"points"`
	User      primitive.ObjectID `json:"user"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type postPopulated struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	Points    int32              `json:"points"`
	User      user               `json:"user"`
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

type getComments struct {
	Post      postPopulated                 `json:"post"`
	Comments  map[string][]commentPopulated `json:"comments"`
	TargetIDs []string                      `json:"targetIds"`
}

type respondGC struct {
	Success bool        `json:"success"`
	Data    getComments `json:"data"`
}

type respondC struct {
	Success bool    `json:"success"`
	Data    comment `json:"data"`
}

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
