package auth

import (
	"os"
	"time"

	"github.com/gofiber/fiber"
)

// Logout //
// @desc logs out the user
// @route POST /api/v1/auth/
// @access Private
func Logout(c *fiber.Ctx) {

	// secure cookie unless in development env
	secure := true
	if os.Getenv("FIBER_ENV") == "development" {
		secure = false
	}

	// set cookie
	cookie := fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(time.Second * 1),
		Secure:   secure,
		HTTPOnly: true,
		SameSite: "strict",
	}
	c.Cookie(&cookie)

	c.Status(200).JSON(respondM{
		Success: true,
		Message: "You have been logged out",
	})
}
