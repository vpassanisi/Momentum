package subs

import "go.mongodb.org/mongo-driver/bson/primitive"

type sub struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
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

type respondS struct {
	Success bool `json:"success"`
	Data    sub  `json:"data"`
}

type respondGS struct {
	Success bool  `json:"success"`
	Data    []sub `json:"data"`
}
