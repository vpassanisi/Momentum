package points

import (
	"time"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Decrement //
// @desc removes a point from a post or comment
// @route POST /api/v1/points/decrement/?type&id
// @access Private
func Decrement(c *fiber.Ctx) {

	targetID, idErr := primitive.ObjectIDFromHex(c.Query("id"))
	if idErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "please include a valid target id",
		})
		return
	}

	userID, idErr := primitive.ObjectIDFromHex(c.Locals("id").(string))
	if idErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad user id",
		})
		return
	}

	var collection *mongo.Collection

	if c.Query("type") == "comment" {
		collection = config.GetCollection("Comments")
	} else if c.Query("type") == "post" {
		collection = config.GetCollection("Posts")
	} else {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "please give a type (comment or post)",
		})
		return
	}

	opts := options.Find().SetLimit(1)

	cur, findErr := collection.Find(c.Context(), bson.M{"_id": targetID}, opts)
	if findErr != nil {
		if findErr == mongo.ErrNoDocuments {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "There is no target with that id",
			})
			return
		}
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem with the query",
		})
		return
	}

	if cur.RemainingBatchLength() == 0 {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "There is no target with that id",
		})
		return
	}

	pointsCollection := config.GetCollection("Points")

	pointCur, findPointErr := pointsCollection.Find(c.Context(), bson.M{
		"user":   userID,
		"target": targetID,
	}, opts)
	if findPointErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "There was a problem querying for the point",
		})
		return
	}

	point := point{}

	if pointCur.RemainingBatchLength() == 0 {
		point.Active = true
		point.Target = targetID
		point.User = userID
		point.UpdatedAt = time.Now().Unix()
		_, InsertOneErr := pointsCollection.InsertOne(c.Context(), point)
		if InsertOneErr != nil {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "There was a problem adding the point to the database",
			})
			return
		}

		if c.Query("type") == "post" {
			post, incrementErr := incrementPost(c, collection, targetID)

			if incrementErr != nil {
				c.Status(500).JSON(respondM{
					Success: false,
					Message: "there was a problem incrementing the target",
				})
				return
			}

			post.Points = post.Points + 1

			c.Status(200).JSON(respondP{
				Success: true,
				Data:    post,
			})
			return
		} else if c.Query("type") == "comment" {
			comment, incrementErr := incrementComment(c, collection, targetID)

			if incrementErr != nil {
				c.Status(500).JSON(respondM{
					Success: false,
					Message: "there was a problem incrementing the target",
				})
				return
			}

			c.Status(200).JSON(respondC{
				Success: true,
				Data:    comment,
			})
			return
		}
	}

}

func incrementPost(c *fiber.Ctx, postsCollection *mongo.Collection, targetID primitive.ObjectID) (post, error) {

	post := post{}

	incrementErr := postsCollection.FindOneAndUpdate(c.Context(), bson.M{"_id": targetID}, bson.M{"$inc": bson.M{"points": -1}}).Decode(&post)

	return post, incrementErr

}

func incrementComment(c *fiber.Ctx, commentsCollection *mongo.Collection, targetID primitive.ObjectID) (comment, error) {

	comment := comment{}

	incrementErr := commentsCollection.FindOneAndUpdate(c.Context(), bson.M{"_id": targetID}, bson.M{"$inc": bson.M{"points": -1}}).Decode(&comment)

	return comment, incrementErr
}
