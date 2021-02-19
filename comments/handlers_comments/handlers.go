package handlers_comments

import (
	"encoding/json"
	"net/http"

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
