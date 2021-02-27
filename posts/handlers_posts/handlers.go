package handlers_posts

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	db "github.com/vpassanisi/Momentum/posts/db_posts"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

	matchElements := bson.D{{"sub", subID}}
	if data.PostID != "" {
		postID, err := primitive.ObjectIDFromHex(data.PostID)
		if err != nil {
			http.Error(w, "not a valid objectID", 400)
			return
		}
		matchElements = append(matchElements, bson.E{"_id", postID})
	}

	log.Print(data.By)
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

func OnePost(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)

	var data postReq
	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, "failed to decode request body", 400)
		return
	}

	postID, err := primitive.ObjectIDFromHex(data.PostID)
	if err != nil {
		http.Error(w, "not a valid objectID", 400)
		return
	}

	matchStage := bson.D{{"$match", bson.M{"_id": postID}}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	cursor, err := db.Client.Database("Project-S").Collection("Posts").Aggregate(req.Context(), mongo.Pipeline{matchStage, lookupStage, unwindStage})
	if err != nil {
		fmt.Println(err)
		http.Error(w, "query error", 400)
		return
	}

	var res []post

	err = cursor.All(req.Context(), &res)
	if err != nil {
		http.Error(w, "There was an error during decode", 500)
		return
	}

	// -- get root comments and populate user field and sort -- //
	matchArr := bson.A{bson.M{"post": postID}, bson.M{"parent": postID}}
	matchStage = bson.D{{"$match", bson.M{"$and": matchArr}}}
	sortStage := bson.D{{"$sort", bson.M{"points": -1, "createdat": -1}}}
	limitStage := bson.D{{"$limit", 10}}
	lookupStage = bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage = bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	rootCommentsCursor, err := db.Client.Database("Project-S").Collection("Comments").Aggregate(req.Context(), mongo.Pipeline{matchStage, sortStage, limitStage, lookupStage, unwindStage})
	if err != nil {
		http.Error(w, "query error", 400)
		return
	}

	rootComments := []commentPopulated{}

	err = rootCommentsCursor.All(req.Context(), &rootComments)
	if err != nil {
		http.Error(w, "cursor loop", 400)
		return
	}

	if len(rootComments) == 0 {
		res[0].TargetIDs = []string{data.PostID}
		res[0].CommentsMap = map[string][]commentPopulated{data.PostID: []commentPopulated{}}

		json, err := json.Marshal(res[0])
		if err != nil {
			http.Error(w, "There was an error during json marshal", 500)
			return
		}
		w.Write(json)
		return
	}

	// -- get comments based on root comments and build comments map -- //
	arr := bson.A{}

	for _, v := range rootComments {
		item := bson.M{"root": v.ID}
		arr = append(arr, item)
	}

	matchStage = bson.D{{"$match", bson.M{"$or": arr}}}

	nonRootComentsCursor, err := db.Client.Database("Project-S").Collection("Comments").Aggregate(req.Context(), mongo.Pipeline{matchStage, sortStage, lookupStage, unwindStage})
	if err != nil {
		http.Error(w, "comment tree query error", 500)
		return
	}

	nonRootComents := []commentPopulated{}

	err = nonRootComentsCursor.All(req.Context(), &nonRootComents)
	if err != nil {
		http.Error(w, "comment tree loop error", 500)
		return
	}

	m := map[string][]commentPopulated{}

	m[postID.Hex()] = rootComments

	for _, v := range rootComments {
		if m[v.ID.Hex()] == nil {
			m[v.ID.Hex()] = []commentPopulated{}
		}
	}

	for _, v := range nonRootComents {
		if m[v.ID.Hex()] == nil {
			m[v.ID.Hex()] = []commentPopulated{}
		}

		if m[v.Parent.Hex()] == nil {
			m[v.Parent.Hex()] = []commentPopulated{}
		}

		m[v.Parent.Hex()] = append(m[v.Parent.Hex()], v)
	}

	targetIds := []string{}

	for k := range m {
		targetIds = append(targetIds, k)
	}

	// -- put comments and comment map into response struct -- //
	res[0].CommentsMap = m
	res[0].TargetIDs = targetIds

	json, err := json.Marshal(res[0])
	if err != nil {
		http.Error(w, "There was an error during json marshal", 500)
		return
	}

	w.Write(json)
}
