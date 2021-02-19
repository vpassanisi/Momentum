package handlers_subs

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SubsReq struct {
	Name  string `json:"name"`
	Order int8   `json:"order"`
	By    string `json:"by"`
}

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
