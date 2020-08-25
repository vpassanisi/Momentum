package comments

import (
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetComments //
// @desc gets the post and comments for a given id
// @route GET /api/v1/comments/?postID&sort&order
// @access Public
func GetComments(c *fiber.Ctx) {

	postID, idErr := primitive.ObjectIDFromHex(c.Query("postID"))
	if idErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad id",
		})
		return
	}

	postsCollection := config.GetCollection("Posts")
	commentsCollection := config.GetCollection("Comments")

	// -- get post and populate user field -- //

	matchStage := bson.D{{"$match", bson.M{"_id": postID}}}
	limitStage := bson.D{{"$limit", 1}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	postCursor, postErr := postsCollection.Aggregate(c.Context(), mongo.Pipeline{matchStage, limitStage, lookupStage, unwindStage})
	if postErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "there was an error populating post",
		})
	}

	post := postPopulated{}

	for postCursor.Next(c.Context()) {
		if err := postCursor.Decode(&post); err != nil {
			log.Fatal(err)
		}
	}
	if err := postCursor.Err(); err != nil {
		log.Fatal(err)
	}

	// -- get root comments and populate user field and sort by query -- //

	order := 1
	if c.Query("order") == "-1" {
		order = -1
	}

	matchStage = bson.D{{"$match", bson.M{"$and": bson.A{bson.M{"post": post.ID}, bson.M{"parent": post.ID}}}}}
	sortStage := bson.D{{"$sort", bson.M{c.Query("sort"): order}}}

	rootCommentsCursor, err := commentsCollection.Aggregate(c.Context(), mongo.Pipeline{matchStage, sortStage, lookupStage, unwindStage})
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "there was an error populating root comments",
		})
	}

	rootComments := []commentPopulated{}

	err = rootCommentsCursor.All(c.Context(), &rootComments)
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	if len(rootComments) == 0 {
		c.Status(200).JSON(respondGC{
			Success: true,
			Data: getComments{
				Post: post,
				Comments: map[string][]commentPopulated{
					post.ID.Hex(): []commentPopulated{},
				},
				TargetIDs: []string{},
			},
		})
		return
	}

	// -- get comments based on root comments -- //

	arr := bson.A{}

	for _, v := range rootComments {
		item := bson.M{"root": v.ID}
		arr = append(arr, item)
	}

	matchStage = bson.D{{"$match", bson.M{"$or": arr}}}

	commentsCursor, err := commentsCollection.Aggregate(c.Context(), mongo.Pipeline{matchStage, sortStage, lookupStage, unwindStage})
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "there was an error populating root comments",
		})
	}

	comments := []commentPopulated{}

	err = commentsCursor.All(c.Context(), &comments)
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		fmt.Println(err)
		return
	}

	mappedComments := mapComments(c, rootComments, comments)

	targetIds := []string{}

	for k := range mappedComments {
		targetIds = append(targetIds, k)
	}

	c.Status(200).JSON(respondGC{
		Success: true,
		Data: getComments{
			Post:      post,
			Comments:  mappedComments,
			TargetIDs: targetIds,
		},
	})
}

func mapComments(c *fiber.Ctx, rootComments []commentPopulated, comments []commentPopulated) map[string][]commentPopulated {

	m := map[string][]commentPopulated{}

	m[c.Query("postID")] = rootComments

	for _, v := range rootComments {
		if m[v.ID.Hex()] == nil {
			m[v.ID.Hex()] = []commentPopulated{}
		}
	}

	for _, v := range comments {
		if m[v.ID.Hex()] == nil {
			m[v.ID.Hex()] = []commentPopulated{}
		}

		if m[v.Parent.Hex()] == nil {
			m[v.Parent.Hex()] = []commentPopulated{}
		}

		m[v.Parent.Hex()] = append(m[v.Parent.Hex()], v)
	}

	return m
}
