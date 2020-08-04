package posts

import "go.mongodb.org/mongo-driver/bson/primitive"

type post struct {
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	User      primitive.ObjectID `json:"user"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type postFull struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	User      primitive.ObjectID `json:"user"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type postSimple struct {
	Title     string `json:"title"`
	Body      string `json:"body"`
	CreatedAt int64  `json:"createdAt"`
}

type getPosts struct {
	Sub   subFull    `json:"sub"`
	Posts []postFull `json:"posts"`
}

type subFull struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Founder     primitive.ObjectID `json:"founder"`
	CreatedAt   int64              `json:"createdAt"`
}

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type respondP struct {
	Success bool       `json:"success"`
	Data    postSimple `json:"data"`
}

type respondGP struct {
	Success bool     `json:"success"`
	Data    getPosts `json:"data"`
}
