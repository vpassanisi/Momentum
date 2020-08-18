package points

import (
	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Increment //
// @desc adds a point to a post or comment
// @route POST /api/v1/points/increment/?type&id
// @access Private
func Increment(c *fiber.Ctx) {
	filter := bson.M{}

	if c.Query("id") != "" {
		id, idErr := primitive.ObjectIDFromHex(c.Query("id"))
		if idErr != nil {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "Bad id",
			})
			return
		}
		filter["_id"] = id
	} else {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "please include an id",
		})
		return
	}

	var collection *mongo.Collection
	var decoded bson.M

	if c.Query("type") == "comment" {
		collection = config.GetCollection("Comments")
	} else if c.Query("type") == "post" {
		collection = config.GetCollection("Posts")
	} else {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "please give a type (comment or post)",
		})
		return
	}

	incrementErr := collection.FindOneAndUpdate(c.Context(), filter, bson.M{"$inc": bson.M{"points": 1}}).Decode(&decoded)
	if incrementErr != nil {
		if incrementErr == mongo.ErrNoDocuments {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "There is no todo with that id",
			})
			return
		}
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem with the query",
		})
	}

}
