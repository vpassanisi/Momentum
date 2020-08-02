package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"github.com/vpassanisi/Project-S/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func respond(str string, c *fiber.Ctx) {
	c.Status(406).JSON(models.RespondM{
		Success: false,
		Message: str,
	})
}

// Register //
// @desc adds a new user to db
// @route POST /api/v1/auth/register
// @access Public
func Register(c *fiber.Ctx) {

	user := models.User{}
	if err := c.BodyParser(&user); err != nil {
		log.Fatal(err)
	}

	if user.Name == "" {
		respond("Please provide a name", c)
		return
	} else if user.Email == "" {
		respond("Please provide an email", c)
		return
	} else if user.Password == "" {
		respond("Please provide a password", c)
		return
	}

	user.Encrypt(user.Password)
	user.SetCreatedAt()

	collection := config.GetCollection("Users")

	insertOneResult, insertErr := collection.InsertOne(c.Context(), user)
	if insertErr != nil {
		err := insertErr.(mongo.WriteException)
		if err.WriteErrors[0].Code == 11000 {
			c.Status(400).JSON(models.RespondM{
				Success: false,
				Message: "That email already exists",
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

	token, getSignedErr := user.GetSignedJWT(insertOneResult.InsertedID.(primitive.ObjectID).Hex())
	if getSignedErr != nil {
		c.Status(400).JSON(models.RespondM{
			Success: false,
			Message: "There was an error getting a token",
		})
		fmt.Println(getSignedErr)
		return
	}

	secure := false
	if os.Getenv("FIBER_ENV") == "production" {
		secure = true
	}

	// set cookie
	cookie := fiber.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 1),
		Secure:   secure,
		HTTPOnly: true,
		SameSite: "strict",
	}
	c.Cookie(&cookie)

	c.Status(200).JSON(models.RespondU{
		Success: true,
		Data: models.UserResponse{
			Name:      user.Name,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
		},
	})
}
