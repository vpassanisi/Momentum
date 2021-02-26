package handlers_comments

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	db "github.com/vpassanisi/Momentum/comments/db_comments"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func Comments(w http.ResponseWriter, req *http.Request) {

	var data commentsReq
	err := json.NewDecoder(req.Body).Decode(&data)
	if err != nil {
		http.Error(w, "could not decode request body", http.StatusBadRequest)
		return
	}

	postID, err := primitive.ObjectIDFromHex(data.PostID)
	if err != nil {
		http.Error(w, "not a valid objectID", 400)
		return
	}

	// -- get root comments and populate user field and sort by query -- //
	op := "$gte"
	cop := "$gt"
	if data.Order == 0 {
		data.Order = -1
		op = "$lte"
		cop = "$lt"
	}

	matchArr := bson.A{bson.M{"post": postID}, bson.M{"parent": postID}}

	if data.LastValue != 0 {
		matchArr = append(matchArr, bson.M{data.By: bson.M{op: data.LastValue}})

		matchArr = append(matchArr, bson.M{"createdat": bson.M{cop: data.LastCreatedAt}})
	}

	matchStage := bson.D{{"$match", bson.M{"$and": matchArr}}}
	sortStage := bson.D{{"$sort", bson.M{data.By: data.Order, "createdat": data.Order}}}
	limitStage := bson.D{{"$limit", 10}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

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

	json, err := json.Marshal(rootComments)
	if err != nil {
		http.Error(w, "There was an error during cursor loop", 500)
		return
	}

	w.Write(json)
}

func NewComment(w http.ResponseWriter, req *http.Request) {

	var data newCommentReq
	err := json.NewDecoder(req.Body).Decode(&data)
	if err != nil {
		http.Error(w, "could not decode request body", http.StatusBadRequest)
		return
	}

	parentID, err := primitive.ObjectIDFromHex(data.ParentID)
	if err != nil {
		http.Error(w, "not a valid parent ID", http.StatusBadRequest)
		return
	}

	postID, err := primitive.ObjectIDFromHex(data.PostID)
	if err != nil {
		http.Error(w, "not a valid post ID", http.StatusBadRequest)
		return
	}

	rootID, err := primitive.ObjectIDFromHex(data.RootID)
	if err != nil {
		http.Error(w, "not a valid root ID", http.StatusBadRequest)
		return
	}

	// get user form token
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

	newCommentData := bson.M{
		"body":      data.Body,
		"points":    0,
		"user":      userID,
		"parent":    parentID,
		"root":      rootID,
		"post":      postID,
		"createdAt": time.Now().Unix(),
	}

	result, err := db.Client.Database("Project-S").Collection("Comments").InsertOne(req.Context(), newCommentData)
	if err != nil {
		http.Error(w, "failed to add comment to db", 400)
		return
	}

	matchStage := bson.D{{"$match", bson.M{"_id": result.InsertedID.(primitive.ObjectID)}}}
	limitStage := bson.D{{"$limit", 1}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	cursor, err := db.Client.Database("Project-S").Collection("Comments").Aggregate(req.Context(), mongo.Pipeline{matchStage, limitStage, lookupStage, unwindStage})
	if err != nil {
		http.Error(w, "could not retrieve comment", http.StatusBadRequest)
		return
	}

	comment := commentPopulated{}

	for cursor.Next(req.Context()) {
		if err := cursor.Decode(&comment); err != nil {
			http.Error(w, "failed to decode comment", http.StatusBadRequest)
			return
		}
	}

	json, err := json.Marshal(comment)
	if err != nil {
		http.Error(w, "There was an error during cursor loop", 500)
		return
	}

	w.Write(json)
}
