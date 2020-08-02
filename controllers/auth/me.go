package auth

import (
	"fmt"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/vpassanisi/Project-S/models"

	"github.com/gofiber/fiber"
)

// Me //
// @desc tells the client if it is logged it
// @route GET /api/v1/auth/
// @access Public
func Me(c *fiber.Ctx) {

	cookie := c.Cookies("token")

	if cookie == "" {
		c.Status(401).JSON(models.RespondM{
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
		c.Status(401).JSON(models.RespondM{
			Success: false,
			Message: "Invalid token",
		})
		return
	}

	// if token is valid and claims are mapped set the users id to the context map with key "id" else abort
	if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		c.Status(200).JSON(models.RespondM{
			Success: true,
			Message: "You are logged in",
		})
	} else {
		c.Status(401).JSON(models.RespondM{
			Success: false,
			Message: "Claims not ok or token is not valid",
		})
	}
}
