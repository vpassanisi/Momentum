package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/vpassanisi/Project-S/config"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// Login //
// @desc logs user in with provided credentials
// @route POST /api/v1/auth/login
// @access Public
func Login(c *fiber.Ctx) {

	credentials := new(models.User)
	if err := c.BodyParser(credentials); err != nil {
		log.Fatal(err)
	}

	result := models.UserFull{}
	usersCollection := config.GetCollection("Users")

	// query for the user email because that is unique
	findOneErr := usersCollection.FindOne(c.Context(), bson.M{
		"email": credentials.Email,
	}).Decode(&result)
	// if query error respond with wrong email
	if findOneErr != nil {
		c.Status(400).JSON(models.RespondM{
			Success: false,
			Message: "That email does not exist",
		})
		return
	}

	compErr := bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(credentials.Password))
	// if there is an error the provided password was incorrect else sign in the user and respond with cookie
	if compErr != nil {
		c.Status(401).JSON(models.RespondM{
			Success: false,
			Message: "Incorrect password",
		})
		return
	}

	token, getSignedErr := credentials.GetSignedJWT(result.ID.Hex())
	// jwt errror, should be rare but needs to return
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
			Name:      result.Name,
			Email:     result.Email,
			CreatedAt: result.CreatedAt,
		},
	})
}
