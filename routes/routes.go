package routes

import (
	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/controllers/auth"
	"github.com/vpassanisi/Project-S/controllers/comments"
	"github.com/vpassanisi/Project-S/controllers/points"
	"github.com/vpassanisi/Project-S/controllers/posts"
	"github.com/vpassanisi/Project-S/controllers/replies"
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
	Subs.Put("/:id", arbiter.Protected, subs.Update)
	Subs.Get("/", subs.GetSubs)

	Posts := v1.Group("/posts")
	Posts.Post("/:sub", arbiter.Protected, posts.Create)
	Posts.Get("/:sub", posts.GetPosts)

	Comments := v1.Group("/comments")
	Comments.Get("/", comments.GetComments)
	Comments.Post("/:post", arbiter.Protected, comments.Create)

	Points := v1.Group("/points")
	Points.Post("/increment", arbiter.Protected, points.Increment)
	Points.Post("/decrement", arbiter.Protected, points.Decrement)

	Replies := v1.Group("/replies")
	Replies.Post("/:commentID", arbiter.Protected, replies.Create)

}
