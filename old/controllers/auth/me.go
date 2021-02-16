package auth

import (
	"fmt"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/gofiber/fiber"
)

// Me //
// @desc tells the client if it is logged it
// @route GET /api/v1/auth/
// @access Public
func Me(c *fiber.Ctx) {

	cookie := c.Cookies("token")

	if cookie == "" {
		c.Status(401).JSON(respondM{
			Success: false,
			Message: "You are not logged in",
		})
		return
	}

	// parse the token.  Parse() uses the returned secret to assign validity and it chacks for expiration of the token
	token, parseErr := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("There was an error")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	// parse error aborts and returns
	if parseErr != nil {
		c.Status(401).JSON(respondM{
			Success: false,
			Message: "Invalid token",
		})
		return
	}

	// if token is valid and claims are mapped set the users id to the context map with key "id" else abort
	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok || !token.Valid {
		c.Status(401).JSON(respondM{
			Success: false,
			Message: "Claims not ok or token is not valid",
		})
		return
	}

	id, err := primitive.ObjectIDFromHex(claims["id"].(string))
	if err != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad id",
		})
		return
	}

	result := user{}

	usersCollection := config.GetCollection("Users")

	findOneErr := usersCollection.FindOne(c.Context(), bson.M{
		"_id": id,
	}).Decode(&result)
	// if query error respond with wrong email
	if findOneErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "That email does not exist",
		})
		return
	}

	c.Status(200).JSON(respondU{
		Success: true,
		Data: userSimple{
			Name:      result.Name,
			Email:     result.Email,
			CreatedAt: result.CreatedAt,
		},
	})

}
