package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SubFull struct {
	ID          primitive.ObjectID `json:"_id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Founder     primitive.ObjectID `json:"founder"`
	CreatedAt   int64              `json:"createdat`
}

type Sub struct {
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Founder     primitive.ObjectID `json:"founder"`
	CreatedAt   int64              `json:"createdat`
}

type SubResponse struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedAt   int64  `json:"createdat`
}

func (sub *Sub) SetCreatedAt() {
	sub.CreatedAt = time.Now().Unix()
}
