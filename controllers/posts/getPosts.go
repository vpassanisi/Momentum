package posts

import (
	"fmt"

	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/gofiber/fiber"
)

// GetPosts //
// @desc gets all posts in a sub and sorts them based on query params
// @route GET /api/v1/posts/?sub&sort&order
// @access Public
func GetPosts(c *fiber.Ctx) {

	order := -1
	if c.Query("order") == "1" {
		order = 1
	}

	posts := []postPopulated{}
	sub := subFull{}

	postsCollection := config.GetCollection("Posts")
	subsCollection := config.GetCollection("Subs")

	err := subsCollection.FindOne(c.Context(), bson.M{
		"name": c.Query("sub"),
	}).Decode(&sub)
	if err != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if err == mongo.ErrNoDocuments {
			c.Status(404).JSON(respondM{
				Success: false,
				Message: "Nothing matched that id",
			})
			return
		}

		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem with the query",
		})
		return
	}

	matchStage := bson.D{{"$match", bson.M{"sub": sub.ID}}}
	limitStage := bson.D{{"$limit", 10}}
	sortStage := bson.D{{"$sort", bson.M{c.Query("sort"): order}}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	cursor, err := postsCollection.Aggregate(c.Context(), mongo.Pipeline{matchStage, limitStage, sortStage, lookupStage, unwindStage})
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error populating posts",
		})

		fmt.Println(err)
		return
	}

	// loop through cursor and put todos in the todos slice of todos
	err = cursor.All(c.Context(), &posts)
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	targetIDs := []string{}

	for _, v := range posts {
		targetIDs = append(targetIDs, v.ID.Hex())
	}

	c.Status(200).JSON(respondGP{
		Success: true,
		Data: getPosts{
			Sub:       sub,
			Posts:     posts,
			TargetIDs: targetIDs,
		},
	})

}
