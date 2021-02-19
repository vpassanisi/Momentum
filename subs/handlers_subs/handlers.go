package handlers_subs

import (
	"encoding/json"
	"fmt"
	"net/http"

	db "github.com/vpassanisi/Momentum/subs/db_subs"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Subs(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)

	var data SubsReq
	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, "failed to decode request body", 400)
		return
	}

	if data.By == "" {
		data.By = "name"
	}
	if data.Order == 0 {
		data.Order = -1
	}

	opts := options.Find().SetSort(bson.D{{data.By, data.Order}})
	filter := bson.M{}

	if data.Name != "" {
		filter["name"] = data.Name
	}

	cursor, err := db.Client.Database("Project-S").Collection("Subs").Find(req.Context(), filter, opts)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "query error", 500)
		return
	}

	subs := []sub{}
	cursorErr := cursor.All(req.Context(), &subs)
	if cursorErr != nil {
		http.Error(w, "There was an error during cursor loop", 500)
		return
	}

	json, err := json.Marshal(subs)
	if err != nil {
		http.Error(w, "There was an error during cursor loop", 500)
		return
	}

	w.Write(json)
}
