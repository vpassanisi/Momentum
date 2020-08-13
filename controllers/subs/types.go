package subs

import "go.mongodb.org/mongo-driver/bson/primitive"

type sub struct {
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

type subSimple struct {
	ID                primitive.ObjectID `json:"_id" bson:"_id"`
	Name              string             `json:"name"`
	Description       string             `json:"description"`
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
	Success bool      `json:"success"`
	Data    subSimple `json:"data"`
}

type respondGS struct {
	Success bool        `json:"success"`
	Data    []subSimple `json:"data"`
}
