package comments

import "go.mongodb.org/mongo-driver/bson/primitive"

type postFull struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	User      primitive.ObjectID `json:"user"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type commentFull struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	Body      string             `json:"body"`
	Points    int64              `json:"points"`
	User      primitive.ObjectID `json:"user"`
	Post      primitive.ObjectID `json:"post"`
	CreatedAt int64              `json:"createdAt"`
}

type comment struct {
	Body      string             `json:"body"`
	Points    int64              `json:"points"`
	User      primitive.ObjectID `json:"user"`
	Post      primitive.ObjectID `json:"post"`
	CreatedAt int64              `json:"createdAt"`
}

type getComments struct {
	Post     postFull      `json:"post"`
	Comments []commentFull `json:"comments"`
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
