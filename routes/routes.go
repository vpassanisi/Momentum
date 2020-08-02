package routes

import (
	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/controllers/auth"
	"github.com/vpassanisi/Project-S/controllers/subs"
	arbiter "github.com/vpassanisi/Project-S/middleware"
	"go.mongodb.org/mongo-driver/mongo"
)

func BuildRoutes(app *fiber.App, client *mongo.Client) {

	api := app.Group("/api")
	v1 := api.Group("/v1")

	Auth := v1.Group("/auth")
	Auth.Post("/login", auth.Login)
	Auth.Post("/register", auth.Register)
	Auth.Get("/", auth.Me)
	Auth.Post("/", arbiter.Protected, auth.Logout)

	Subs := v1.Group("/subs")
	Subs.Post("/", arbiter.Protected, subs.Create)

}
