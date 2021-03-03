package handlers_subs

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	db "github.com/vpassanisi/Momentum/subs/db_subs"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func NewSub(w http.ResponseWriter, req *http.Request) {

	var data newSubReq
	err := json.NewDecoder(req.Body).Decode(&data)
	if err != nil {
		http.Error(w, "failed to decode request body", 400)
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

	founderID, err := primitive.ObjectIDFromHex(reqUser.ID)
	if err != nil {
		http.Error(w, "not a valid user ID", http.StatusBadRequest)
		return
	}

	newSub := bson.M{
		"name":              data.Name,
		"description":       data.Description,
		"founder":           founderID,
		"banner":            data.Banner,
		"icon":              data.Icon,
		"colorPrimary":      data.ColorPrimary,
		"colorPrimaryLight": data.ColorPrimaryLight,
		"colorPrimaryDark":  data.ColorPrimaryDark,
		"createdAt":         time.Now().Unix(),
	}

	_, err = db.Client.Database("Project-S").Collection("Subs").InsertOne(req.Context(), newSub)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "failed to add sub to db", 400)
		return
	}

	json, _ := json.Marshal(map[string]string{
		"subName": data.Name,
	})

	w.Write(json)
}
