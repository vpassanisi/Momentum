package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/vpassanisi/Project-S/config"

	"github.com/gofiber/fiber"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// Login //
// @desc logs user in with provided credentials
// @route POST /api/v1/auth/login
// @access Public
func Login(c *fiber.Ctx) {

	cred := user{}
	if err := c.BodyParser(&cred); err != nil {
		log.Fatal(err)
	}

	result := userResult{}
	usersCollection := config.GetCollection("Users")

	// query for the user email because that is unique
	findOneErr := usersCollection.FindOne(c.Context(), bson.M{
		"email": cred.Email,
	}).Decode(&result)
	// if query error respond with wrong email
	if findOneErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "That email does not exist",
		})
		return
	}

	compErr := bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(cred.Password))
	// if there is an error the provided password was incorrect else sign in the user and respond with cookie
	if compErr != nil {
		c.Status(401).JSON(respondM{
			Success: false,
			Message: "Incorrect password",
		})
		return
	}

	token, getSignedErr := getSignedJWT(result._id.Hex())
	// jwt errror, should be rare but needs to return
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
			Name:      result.Name,
			Email:     result.Email,
			CreatedAt: result.CreatedAt,
		},
	})
}
