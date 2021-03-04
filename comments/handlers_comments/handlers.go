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

func CommentsMap(w http.ResponseWriter, req *http.Request) {

	var data commentsMapReq
	err := json.NewDecoder(req.Body).Decode(&data)
	if err != nil {
		http.Error(w, "failed to decode request body", 400)
		return
	}

	postID, err := primitive.ObjectIDFromHex(data.PostID)
	if err != nil {
		http.Error(w, "not a valid objectID", 400)
		return
	}

	op := "$lt"
	if data.Order == 1 {
		op = "$gt"
	}
	matchArr := bson.A{bson.M{"post": postID}, bson.M{"parent": postID}}

	if data.LastCreatedAt != 0 {
		matchArr = append(matchArr, bson.M{"$or": bson.A{bson.M{data.SortBy: bson.M{op: data.LastValue}}, bson.M{data.SortBy: data.LastValue, "createdAt": bson.M{op: data.LastCreatedAt}}}})
	}

	// -- get root comments and populate user field and sort -- //

	matchStage := bson.D{{"$match", bson.M{"$and": matchArr}}}
	sortStage := bson.D{{"$sort", bson.M{data.SortBy: data.Order, "createdAt": data.Order}}}
	limitStage := bson.D{{"$limit", 10}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	rootCommentsCursor, err := db.Client.Database("Project-S").Collection("Comments").Aggregate(req.Context(), mongo.Pipeline{sortStage, matchStage, limitStage, lookupStage, unwindStage})
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
		res := map[string][]commentPopulated{}
		json, err := json.Marshal(res)
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

	// -- respond-- //
	json, err := json.Marshal(m)
	if err != nil {
		http.Error(w, "There was an error during json marshal", 500)
		return
	}

	w.Write(json)
}

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
