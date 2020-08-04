package posts

import (
	"fmt"
	"log"
	"time"

	arbiter "github.com/vpassanisi/Project-S/middleware"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"github.com/vpassanisi/Project-S/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func Create(c *fiber.Ctx) {

	claims := arbiter.GetClaims()

	user, objErr := primitive.ObjectIDFromHex(claims["id"].(string))
	if objErr != nil {
		c.Status(400).JSON(models.RespondM{
			Success: false,
			Message: "Bad cookie",
		})
	}

	sub, subErr := primitive.ObjectIDFromHex(c.Params("sub"))
	if subErr != nil {
		c.Status(400).JSON(models.RespondM{
			Success: false,
			Message: "Bad sub id",
		})
	}

	post := models.Post{
		CreatedAt: time.Now().Unix(),
		User:      user,
		Sub:       sub,
	}
	if err := c.BodyParser(&post); err != nil {
		log.Fatal(err)
	}

	fmt.Println(post)

	collection := config.GetCollection("Posts")

	_, insertErr := collection.InsertOne(c.Context(), post)
	if insertErr != nil {
		err := insertErr.(mongo.WriteException)
		if err.WriteErrors[0].Code == 11000 {
			c.Status(400).JSON(models.RespondM{
				Success: false,
				Message: "That post already exists",
			})
		} else if err.WriteErrors[0].Code == 121 {
			c.Status(400).JSON(models.RespondM{
				Success: false,
				Message: err.WriteErrors[0].Message,
			})
		} else {
			c.Status(400).JSON(models.RespondM{
				Success: false,
				Message: "There was a problem adding the document to the database",
			})
		}
		return
	}

	c.Status(200).JSON(models.RespondP{
		Success: true,
		Data: models.PostResponse{
			Title:     post.Title,
			Body:      post.Body,
			CreatedAt: post.CreatedAt,
		},
	})

}
