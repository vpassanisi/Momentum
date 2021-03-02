package handlers_posts

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	db "github.com/vpassanisi/Momentum/posts/db_posts"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func Posts(w http.ResponseWriter, req *http.Request) {

	var data postsReq
	err := json.NewDecoder(req.Body).Decode(&data)
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

	matchElements := bson.D{{"sub", subID}}
	if data.PostID != "" {
		postID, err := primitive.ObjectIDFromHex(data.PostID)
		if err != nil {
			http.Error(w, "not a valid objectID", 400)
			return
		}
		matchElements = append(matchElements, bson.E{"_id", postID})
	}

	matchStage := bson.D{{"$match", matchElements}}
	limitStage := bson.D{{"$limit", 10}}
	sortStage := bson.D{{"$sort", bson.M{data.By: data.Order}}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	cursor, err := db.Client.Database("Project-S").Collection("Posts").Aggregate(req.Context(), mongo.Pipeline{matchStage, limitStage, sortStage, lookupStage, unwindStage})
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

func NewPost(w http.ResponseWriter, req *http.Request) {

	var data addPostReq
	err := json.NewDecoder(req.Body).Decode(&data)
	if err != nil {
		http.Error(w, "failed to decode request body", 400)
		return
	}

	subID, err := primitive.ObjectIDFromHex(data.SubID)
	if err != nil {
		http.Error(w, "not a valid sub ID", http.StatusBadRequest)
		return
	}

	postBody, _ := json.Marshal(map[string]string{
		"token": data.Token,
	})
	reqBody := bytes.NewBuffer(postBody)
	res, err := http.Post("http://users:5000/me", "application/json", reqBody)
	if err != nil {
		http.Error(w, "could not reach users service", 400)
		return
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		http.Error(w, "could not read user", 400)
		return
	}

	var reqUser meRes
	err = json.Unmarshal(body, &reqUser)
	if err != nil {
		http.Error(w, "could not unmarshal user", 400)
		return
	}

	userID, err := primitive.ObjectIDFromHex(reqUser.ID)
	if err != nil {
		http.Error(w, "not a valid user ID", http.StatusBadRequest)
		return
	}

	newPost := bson.M{
		"title":     data.Title,
		"body":      data.Body,
		"sub":       subID,
		"points":    0,
		"user":      userID,
		"createdAt": time.Now().Unix(),
	}

	result, err := db.Client.Database("Project-S").Collection("Posts").InsertOne(req.Context(), newPost)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "failed to add post to db", 400)
		return
	}

	json, _ := json.Marshal(map[string]string{
		"postID": result.InsertedID.(primitive.ObjectID).Hex(),
	})

	w.Write(json)
}
