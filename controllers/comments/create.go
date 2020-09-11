package comments

import (
	"log"
	"time"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Create //
// @desc creates a new comment and adds it to the database
// @route POST /api/v1/comments/:post
// @access Private
func Create(c *fiber.Ctx) {

	user, objErr := primitive.ObjectIDFromHex(c.Locals("id").(string))
	if objErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad cookie",
		})
		return
	}

	post, postErr := primitive.ObjectIDFromHex(c.Params("post"))
	if postErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad post id",
		})
		return
	}

	newComment := comment{
		CreatedAt: time.Now().Unix(),
		User:      user,
		Post:      post,
		Points:    0,
	}

	if err := c.BodyParser(&newComment); err != nil {
		log.Fatal(err)
	}

	commentsCollection := config.GetCollection("Comments")

	id, insertErr := commentsCollection.InsertOne(c.Context(), newComment)
	if insertErr != nil {
		err := insertErr.(mongo.WriteException)
		if err.WriteErrors[0].Code == 121 {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: err.WriteErrors[0].Message,
			})
		} else {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "There was a problem adding the document to the database",
			})
		}
		return
	}

	matchStage := bson.D{{"$match", bson.M{"_id": id.InsertedID.(primitive.ObjectID)}}}
	limitStage := bson.D{{"$limit", 1}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "Users"}, {"localField", "user"}, {"foreignField", "_id"}, {"as", "user"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$user"}, {"preserveNullAndEmptyArrays", false}}}}

	cursor, err := commentsCollection.Aggregate(c.Context(), mongo.Pipeline{matchStage, limitStage, lookupStage, unwindStage})
	if err != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "there was an error populating the comment",
		})
	}

	comment := commentPopulated{}

	for cursor.Next(c.Context()) {
		if err := cursor.Decode(&comment); err != nil {
			log.Fatal(err)
		}
	}

	c.Status(200).JSON(respondCP{
		Success: true,
		Data:    comment,
	})
}
