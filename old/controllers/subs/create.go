package subs

import (
	"fmt"
	"log"
	"time"

	"github.com/vpassanisi/Project-S/config"

	"github.com/gofiber/fiber"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Create //
// @desc makes a new Sub and adds it to the database
// @route POST /api/v1/subs/
// @access Private
func Create(c *fiber.Ctx) {

	sub := sub{}
	if err := c.BodyParser(&sub); err != nil {
		log.Fatal(err)
	}

	sub.CreatedAt = time.Now().Unix()

	userID, objErr := primitive.ObjectIDFromHex(c.Locals("id").(string))
	if objErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad cookie",
		})
	}

	sub.Founder = userID

	subsCollection := config.GetCollection("Subs")

	result, insertErr := subsCollection.InsertOne(c.Context(), sub)
	if insertErr != nil {
		err := insertErr.(mongo.WriteException)
		if err.WriteErrors[0].Code == 11000 {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "That sub already exists",
			})
		} else {
			fmt.Println(err.WriteErrors[0])
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "There was an error adding the new document to the database",
			})
		}
		return
	}

	sub.ID = result.InsertedID.(primitive.ObjectID)

	c.Status(200).JSON(respondS{
		Success: true,
		Data:    sub,
	})
}