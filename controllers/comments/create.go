package comments

import (
	"log"
	"time"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	arbiter "github.com/vpassanisi/Project-S/middleware"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Create //
// @desc creates a new comment and adds it to the database
// @route POST /api/v1/comments/:post
// @access Private
func Create(c *fiber.Ctx) {

	claims := arbiter.GetClaims()

	user, objErr := primitive.ObjectIDFromHex(claims["id"].(string))
	if objErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad cookie",
		})
		return
	}

	post, subErr := primitive.ObjectIDFromHex(c.Params("post"))
	if subErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad sub id",
		})
		return
	}

	newComment := comment{
		CreatedAt: time.Now().Unix(),
		User:      user,
		Post:      post,
		Points:    0,
	}

	if err := c.BodyParser(&newComment); err != nil {
		log.Fatal(err)
	}

	commentsCollection := config.GetCollection("Comments")

	id, insertErr := commentsCollection.InsertOne(c.Context(), newComment)
	if insertErr != nil {
		err := insertErr.(mongo.WriteException)
		if err.WriteErrors[0].Code == 121 {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: err.WriteErrors[0].Message,
			})
		} else {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "There was a problem adding the document to the database",
			})
		}
		return
	}

	newComment.ID = id.InsertedID.(primitive.ObjectID)

	c.Status(200).JSON(respondC{
		Success: true,
		Data:    newComment,
	})
}
