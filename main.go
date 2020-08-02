package main

import (
	"github.com/gofiber/fiber"
	"github.com/gofiber/fiber/middleware"
	"github.com/joho/godotenv"
	"github.com/qinains/fastergoding"
	"github.com/vpassanisi/Project-S/config"
	"github.com/vpassanisi/Project-S/routes"
)

func main() {
	fastergoding.Run()
	godotenv.Load()

	app := fiber.New()

	app.Use(middleware.Recover())
	app.Use(middleware.Logger())

	client := config.ConnectDB()

	routes.BuildRoutes(app, client)

	app.Listen(3000)
}
