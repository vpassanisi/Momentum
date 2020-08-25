package points

import (
	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// RemoveCommentPoint //
// @desc removes a point document from the db
// @route DELETE /api/v1/points/comment/:targetId
// @access Private
func RemoveCommentPoint(c *fiber.Ctx) {

	targetID, err := primitive.ObjectIDFromHex(c.Params("targetId"))
	if err != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "please include a valid target id",
		})
		return
	}

	userID, err := primitive.ObjectIDFromHex(c.Locals("id").(string))
	if err != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad user id",
		})
		return
	}

	// -- get point document -- //

	pointsCollection := config.GetCollection("Points")

	filter := bson.M{
		"user":   userID,
		"target": targetID,
	}

	point := point{}

	err = pointsCollection.FindOne(c.Context(), filter).Decode(&point)
	if err != nil {
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.Status(404).JSON(respondM{
					Success: false,
					Message: "No point with that id",
				})
				return
			}

			c.Status(500).JSON(respondM{
				Success: false,
				Message: "There was a problem with the query",
			})
			return
		}
	}

	// -- if point is Active subtract one form target else add one too target -- //

	commentsCollection := config.GetCollection("Comments")

	filter = bson.M{"_id": targetID}
	update := bson.M{}

	if point.Active {
		update = bson.M{"$inc": bson.M{"points": -1}}
	}

	if !point.Active {
		update = bson.M{"$inc": bson.M{"points": 1}}
	}

	comment := comment{}

	err = commentsCollection.FindOneAndUpdate(c.Context(), filter, update).Decode(&comment)
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "there was a problem updating the target",
		})
		return
	}

	if point.Active {
		comment.Points = comment.Points - 1
	}

	if !point.Active {
		comment.Points = comment.Points + 1
	}

	// -- delete point doc from db -- //

	filter = bson.M{
		"user":   userID,
		"target": targetID,
	}

	_, err = pointsCollection.DeleteOne(c.Context(), filter)
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem deleting from the database",
		})
		return
	}

	c.Status(200).JSON(respondC{
		Success: true,
		Data:    comment,
	})
}
