package handlers_posts

import (
	"encoding/json"
	"fmt"
	"net/http"

	db "github.com/vpassanisi/Momentum/posts/db_posts"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Posts(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)

	var data postsReq
	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, "failed to decode request body", 400)
		return
	}

	if data.By == "" {
		data.By = "createdAt"
	}
	if data.Order == 0 {
		data.Order = -1
	}
	if data.Sub == "" {
		http.Error(w, "must provide a sub", 400)
		return
	}

	subID, err := primitive.ObjectIDFromHex(data.Sub)
	if err != nil {
		http.Error(w, "not a valid objectID", 400)
		return
	}

	opts := options.Find().SetSort(bson.D{{data.By, data.Order}})
	filter := bson.M{"sub": subID}

	cursor, err := db.Client.Database("Project-S").Collection("Posts").Find(req.Context(), filter, opts)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "query error", 500)
		return
	}

	posts := []post{}
	cursorErr := cursor.All(req.Context(), &posts)
	if cursorErr != nil {
		http.Error(w, "There was an error during cursor loop", 500)
		return
	}

	json, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "There was an error during cursor loop", 500)
		return
	}

	w.Write(json)
}

func OnePost(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)

	var data postReq
	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, "failed to decode request body", 400)
		return
	}

	ID, err := primitive.ObjectIDFromHex(data.ID)
	if err != nil {
		http.Error(w, "not a valid objectID", 400)
		return
	}

	filter := bson.M{"_id": ID}

	var res post

	err = db.Client.Database("Project-S").Collection("Posts").FindOne(req.Context(), filter).Decode(&res)
	if err != nil {
		http.Error(w, "query error", 400)
		return
	}

	json, err := json.Marshal(res)
	if err != nil {
		http.Error(w, "There was an error during cursor loop", 500)
		return
	}

	w.Write(json)
}
