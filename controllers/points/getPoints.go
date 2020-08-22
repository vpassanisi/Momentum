package points

import (
	"log"

	"github.com/vpassanisi/Project-S/config"

	"github.com/gofiber/fiber"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetPoints //
// @desc gets points from an array of ids
// @route GET /api/v1/points/
// @access Private
func GetPoints(c *fiber.Ctx) {

	// -- parse request body and convert user id to objectid -- //

	ids := ids{}

	if err := c.BodyParser(&ids); err != nil {
		log.Fatal(err)
	}

	arr := []bson.M{}

	for _, v := range ids.IDs {
		id, err := primitive.ObjectIDFromHex(v)
		if err != nil {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "Bad id",
			})
			return
		}
		arr = append(arr, bson.M{"target": id})
	}

	userID, err := primitive.ObjectIDFromHex(c.Locals("id").(string))
	if err != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad cookie",
		})
		return
	}

	// -- get all points that match the users id and the ids provided -- //

	pointsCollection := config.GetCollection("Points")

	// filter := bson.M{
	// 	"$and": bson.A{
	// 		bson.M{"_id": userID},
	// 		bson.M{"$or": arr},
	// 	},
	// }

	filter := bson.M{
		"$and": []bson.M{
			bson.M{"user": userID},
			bson.M{"$or": arr},
		},
	}

	cursor, err := pointsCollection.Find(c.Context(), filter)
	if err != nil {
		log.Fatal(err)
	}

	points := []point{}

	err = cursor.All(c.Context(), &points)
	if err != nil {
		log.Fatal(err)
	}

	// -- return map of points -- //

	m := map[string]bool{}

	for _, v := range points {
		m[v.Target.Hex()] = v.Active
	}

	c.Status(200).JSON(respondMP{
		Success: true,
		Data:    m,
	})

}
