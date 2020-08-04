package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SubFull struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Founder     primitive.ObjectID `json:"founder"`
	CreatedAt   int64              `json:"createdAt"`
}

type Sub struct {
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Founder     primitive.ObjectID `json:"founder" bson:"_id"`
	CreatedAt   int64              `json:"createdAt"`
}

type SubResponse struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedAt   int64  `json:"createdAt"`
}

func (sub *Sub) SetCreatedAt() {
	sub.CreatedAt = time.Now().Unix()
}
