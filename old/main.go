package main

import (
	"os"

	"github.com/gofiber/fiber"
	"github.com/gofiber/fiber/middleware"
	"github.com/joho/godotenv"
	"github.com/vpassanisi/Project-S/config"
	"github.com/vpassanisi/Project-S/routes"
)

func main() {
	godotenv.Load()
	app := fiber.New()

	app.Use(middleware.Recover())
	app.Use(middleware.Logger())

	client := config.ConnectDB()

	app.Static("/", "client/dist")

	routes.BuildRoutes(app, client)

	app.Listen(os.Getenv("PORT"))
}
