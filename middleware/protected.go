package arbiter

import (
	"fmt"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
)

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

var claims jwt.MapClaims
var ok bool

func Protected(c *fiber.Ctx) {
	cookie := c.Cookies("token")

	if cookie == "" {
		c.Status(401).JSON(respondM{
			Success: false,
			Message: "You must be logged in to access this endpoint",
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
	if claims, ok = token.Claims.(jwt.MapClaims); ok && token.Valid {
		c.Next()
	} else {
		c.Status(401).JSON(respondM{
			Success: false,
			Message: "Claims not ok or token is not valid",
		})
	}
}

func GetClaims() jwt.MapClaims {
	return claims
}
