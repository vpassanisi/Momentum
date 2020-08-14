package comments

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetPost //
// @desc gets the post and comments for a given id
// @route GET /api/v1/posts/:sub/:id
// @access Public
func GetComments(c *fiber.Ctx) {

	post := post{}
	comments := []comment{}

	id, idErr := primitive.ObjectIDFromHex(c.Params("post"))
	if idErr != nil {
		c.Status(400).JSON(respondM{
			Success: false,
			Message: "Bad id",
		})
		return
	}

	postsCollection := config.GetCollection("Posts")
	commentsCollection := config.GetCollection("Comments")
	usersCollection := config.GetCollection("Users")

	findOneErr := postsCollection.FindOne(c.Context(), bson.M{
		"_id": id,
	}).Decode(&post)
	if findOneErr != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if findOneErr == mongo.ErrNoDocuments {
			c.Status(404).JSON(respondM{
				Success: false,
				Message: "Nothing matched that id",
			})
			return
		}

		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem with the query",
		})
		return
	}

	// user isn't used for anything ????
	user := bson.M{}

	findUserErr := usersCollection.FindOne(c.Context(), bson.M{
		"_id": post.User,
	}).Decode(&user)
	if findUserErr != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if findUserErr == mongo.ErrNoDocuments {
			c.Status(404).JSON(respondM{
				Success: false,
				Message: "Nothing matched that id",
			})
			return
		}

		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was a problem with the query",
		})
		return
	}

	cursor, findErr := commentsCollection.Find(c.Context(), bson.M{
		"post": post.ID,
	})
	if findErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during query",
		})

		fmt.Println(findErr)
		return
	}

	// loop through cursor and put todos in the todos slice of todos
	cursorErr := cursor.All(c.Context(), &comments)
	if cursorErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	if len(comments) == 0 {
		c.Status(200).JSON(respondGC{
			Success: true,
			Data: getComments{
				Post: post,
				Comments: bson.M{
					post.ID.Hex(): []commentPopulated{},
				},
			},
		})
		return
	}

	mappedComments := populateAndMapUsers(comments, c)

	c.Status(200).JSON(respondGC{
		Success: true,
		Data: getComments{
			Post:     post,
			Comments: mappedComments,
		},
	})
}

func populateAndMapUsers(comments []comment, c *fiber.Ctx) bson.M {
	var populatedComments []commentPopulated
	mappedComments := bson.M{}

	usersCollection := config.GetCollection("Users")

	for _, v := range comments {
		user := user{}

		mappedComments[v.ID.Hex()] = []commentPopulated{}
		mappedComments[v.Post.Hex()] = []commentPopulated{}

		comment := commentPopulated{
			ID:        v.ID,
			Body:      v.Body,
			Points:    v.Points,
			Post:      v.Post,
			Parent:    v.Parent,
			CreatedAt: v.CreatedAt,
		}

		findOneErr := usersCollection.FindOne(c.Context(), bson.M{
			"_id": v.User,
		}).Decode(&user)
		if findOneErr != nil {
			log.Fatal(findOneErr)
		}

		comment.User = user

		populatedComments = append(populatedComments, comment)
	}

	for _, v := range populatedComments {
		mappedComments[v.Parent.Hex()] = append(mappedComments[v.Parent.Hex()].([]commentPopulated), v)
	}

	return mappedComments
}
