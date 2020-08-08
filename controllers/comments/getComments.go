package comments

import (
	"fmt"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetPost //
// @desc gets the post and comments for a given id
// @route GET /api/v1/posts/:sub/:id
// @access Public
func GetComments(c *fiber.Ctx) {

	post := postFull{}
	comments := []commentFull{}

	id, idErr := primitive.ObjectIDFromHex(c.Params("post"))
	if idErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad id",
		})
		return
	}

	postsCollection := config.GetCollection("Posts")
	commentsCollection := config.GetCollection("Comments")

	findOneErr := postsCollection.FindOne(c.Context(), bson.M{
		"_id": id,
	}).Decode(&post)
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

	cursor, findErr := commentsCollection.Find(c.Context(), bson.M{
		"post": post.ID,
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
	cursorErr := cursor.All(c.Context(), &comments)
	if cursorErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	c.Status(200).JSON(respondGC{
		Success: true,
		Data: getComments{
			Post:     post,
			Comments: comments,
		},
	})
}
