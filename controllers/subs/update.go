package subs

import (
	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Update //
// @desc update a sub
// @route PUT /api/v1/subs/:id
// @access Public
func Update(c *fiber.Ctx) {

	fields := bson.M{}

	if bindErr := c.BodyParser(&fields); bindErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem binding JSON",
		})
	}

	// sets the operator for the fileds to be updated
	update := bson.M{"$set": fields}

	// new ObjectID from request params.  this is the id of the document to be updated
	id, objErr := primitive.ObjectIDFromHex(c.Params("id"))
	if objErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "That is not an id",
		})
	}

	todosCollection := config.GetCollection("Subs")

	// this will be the document BEFORE it has been updated
	// this must be a map so that I can index it and update the values because I want to return the updated document
	updated := bson.M{}

	// find one by id and update
	updateErr := todosCollection.FindOneAndUpdate(c.Context(), bson.M{"_id": id}, update).Decode(&updated)
	if updateErr != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if updateErr == mongo.ErrNoDocuments {
			c.Status(400).JSON(respondM{
				Success: false,
				Message: "There is no todo with that id",
			})
			return
		}
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem with the query",
		})
	}

	// merge the updated fileds with the document that has been returned from the update operation
	for key, value := range fields {
		updated[key] = value
	}

	c.Status(200).JSON(respondS{
		Success: true,
		Data: subSimple{
			ID:          updated["_id"].(primitive.ObjectID),
			Name:        updated["name"].(string),
			Description: updated["description"].(string),
			Banner:      updated["banner"].(string),
			CreatedAt:   updated["createdat"].(int64),
		},
	})
}
