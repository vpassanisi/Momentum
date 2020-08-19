package replies

import (
	"log"
	"time"

	"github.com/vpassanisi/Project-S/config"

	"github.com/gofiber/fiber"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Create //
// @desc creates a new reply and adds it to the database
// @route POST /api/v1/replies/:comment
// @access Private
func Create(c *fiber.Ctx) {

	userID, userErr := primitive.ObjectIDFromHex(c.Locals("id").(string))
	if userErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad cookie",
		})
		return
	}

	commentID, commentErr := primitive.ObjectIDFromHex(c.Params("comment"))
	if commentErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad sub id",
		})
		return
	}

	newReply := reply{
		CreatedAt: time.Now().Unix(),
		Points:    0,
		User:      userID,
		Comment:   commentID,
	}

	if err := c.BodyParser(&newReply); err != nil {
		log.Fatal(err)
	}

	repliesCollection := config.GetCollection("Replies")

	replyID, insertErr := repliesCollection.InsertOne(c.Context(), newReply)
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

	newReply.ID = replyID.InsertedID.(primitive.ObjectID)

	c.Status(200).JSON(respondR{
		Success: true,
		Data:    newReply,
	})
}
