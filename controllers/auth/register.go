package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Register //
// @desc adds a new user to db
// @route POST /api/v1/auth/register
// @access Public
func Register(c *fiber.Ctx) {

	user := user{}
	if err := c.BodyParser(&user); err != nil {
		log.Fatal(err)
	}

	user.encrypt(user.Password)
	user.CreatedAt = time.Now().Unix()

	collection := config.GetCollection("Users")

	insertOneResult, insertErr := collection.InsertOne(c.Context(), user)
	if insertErr != nil {
		err := insertErr.(mongo.WriteException)
		if err.WriteErrors[0].Code == 11000 {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "That email already exists",
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

	token, getSignedErr := getSignedJWT(insertOneResult.InsertedID.(primitive.ObjectID).Hex())
	if getSignedErr != nil {
		c.Status(400).JSON(respondM{
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

	c.Status(200).JSON(respondU{
		Success: true,
		Data: userSimple{
			Name:      user.Name,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
		},
	})
}
