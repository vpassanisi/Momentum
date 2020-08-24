package posts

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type post struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	User      primitive.ObjectID `json:"user"`
	Points    int32              `json:"points"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type postPopulated struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	User      user               `json:"user"`
	Points    int32              `json:"points"`
	Sub       primitive.ObjectID `json:"sub"`
	CreatedAt int64              `json:"createdAt"`
}

type user struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Name      string             `json:"name"`
	Email     string             `json:"-"`
	Password  string             `json:"-"`
	CreatedAt int64              `json:"createdAt"`
}

type getPosts struct {
	Sub   subFull         `json:"sub"`
	Posts []postPopulated `json:"posts"`
}

type subFull struct {
	ID                primitive.ObjectID `json:"_id" bson:"_id"`
	Name              string             `json:"name"`
	Description       string             `json:"description"`
	Founder           primitive.ObjectID `json:"founder"`
	Banner            string             `json:"banner"`
	CreatedAt         int64              `json:"createdAt"`
	Icon              string             `json:"icon"`
	ColorPrimary      string             `json:"colorPrimary"`
	ColorPrimaryLight string             `json:"colorPrimaryLight"`
	ColorPrimaryDark  string             `json:"colorPrimaryDark"`
}

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type respondP struct {
	Success bool `json:"success"`
	Data    post `json:"data"`
}

type respondGP struct {
	Success bool     `json:"success"`
	Data    getPosts `json:"data"`
}
