package posts

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/gofiber/fiber"
)

func GetPosts(c *fiber.Ctx) {

	posts := []postFull{}
	sub := subFull{}
	subID, objErr := primitive.ObjectIDFromHex(c.Params("sub"))
	if objErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad id",
		})
	}

	postsCollection := config.GetCollection("Posts")
	subsCollection := config.GetCollection("Subs")

	findOneErr := subsCollection.FindOne(c.Context(), bson.M{
		"_id": subID,
	}).Decode(&sub)
	if findOneErr != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if findOneErr == mongo.ErrNoDocuments {
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

	// query db and filter by user id
	cursor, findErr := postsCollection.Find(c.Context(), bson.M{
		"sub": subID,
	})
	if findErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during query",
		})

		fmt.Println(findErr)
		return
	}

	// loop through cursor and put todos in the todos slice of todos
	cursorErr := cursor.All(c.Context(), &posts)
	if cursorErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	c.Status(200).JSON(respondGP{
		Success: true,
		Data: getPosts{
			Sub:   sub,
			Posts: posts,
		},
	})

}
