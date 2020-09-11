package subs

import (
	"fmt"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetSubs //
// @desc gets subs and sorts them based on query params
// @route GET /api/v1/subs/?key&order&*name&*id
// @access Private
func GetSubs(c *fiber.Ctx) {
	subs := []sub{}
	filter := bson.M{}
	key := c.Query("key")
	order := -1

	if key == "" {
		key = "name"
	}

	if c.Query("order") == "asc" {
		order = 1
	} else if c.Query("order") == "desc" {
		order = -1
	}

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
	}

	if c.Query("name") != "" {
		filter["name"] = c.Query("name")
	}

	subsCollection := config.GetCollection("Subs")

	opts := options.Find().SetSort(bson.D{{key, order}})

	cursor, findErr := subsCollection.Find(c.Context(), filter, opts)
	if findErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during query",
		})

		fmt.Println(findErr)
		return
	}

	// loop through cursor and put todos in the todos slice of todos
	cursorErr := cursor.All(c.Context(), &subs)
	if cursorErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	c.Status(200).JSON(respondGS{
		Success: true,
		Data:    subs,
	})

}
