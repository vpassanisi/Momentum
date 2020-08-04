package subs

import "go.mongodb.org/mongo-driver/bson/primitive"

type sub struct {
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Founder     primitive.ObjectID `json:"founder" bson:"_id"`
	CreatedAt   int64              `json:"createdAt"`
}

type subFull struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Founder     primitive.ObjectID `json:"founder"`
	CreatedAt   int64              `json:"createdAt"`
}

type subSimple struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedAt   int64  `json:"createdAt"`
}

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type respondS struct {
	Success bool      `json:"success"`
	Data    subSimple `json:"data"`
}
