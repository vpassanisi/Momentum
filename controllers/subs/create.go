package subs

import (
	"fmt"
	"log"

	"github.com/vpassanisi/Project-S/config"
	arbiter "github.com/vpassanisi/Project-S/middleware"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Create //
// @desc makes a new Sub and adds it to the database
// @route POST /api/v1/subs/
// @access Private
func Create(c *fiber.Ctx) {

	sub := models.Sub{}
	if err := c.BodyParser(&sub); err != nil {
		log.Fatal(err)
	}

	sub.SetCreatedAt()

	claims := arbiter.GetClaims()

	id, objErr := primitive.ObjectIDFromHex(claims["id"].(string))
	if objErr != nil {
		c.Status(400).JSON(models.RespondM{
			Success: false,
			Message: "Bad cookie",
		})
	}

	sub.Founder = id

	subsCollection := config.GetCollection("Subs")

	_, insertErr := subsCollection.InsertOne(c.Context(), sub)
	if insertErr != nil {
		err := insertErr.(mongo.WriteException)
		if err.WriteErrors[0].Code == 11000 {
			c.Status(400).JSON(models.RespondM{
				Success: false,
				Message: "That sub already exists",
			})
		} else {
			fmt.Println(err.WriteErrors[0])
			c.Status(400).JSON(models.RespondM{
				Success: false,
				Message: "There was an error adding the new document to the database",
			})
		}
		return
	}

	c.Status(200).JSON(models.RespondS{
		Success: true,
		Data: models.SubResponse{
			Name:        sub.Name,
			Description: sub.Description,
			CreatedAt:   sub.CreatedAt,
		},
	})
}
