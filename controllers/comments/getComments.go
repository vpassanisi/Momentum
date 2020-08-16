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

	user := user{}

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

	populatedPost := postPopulated{
		ID:        post.ID,
		Title:     post.Title,
		Body:      post.Body,
		Points:    post.Points,
		Sub:       post.Sub,
		User:      user,
		CreatedAt: post.CreatedAt,
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
				Post: populatedPost,
				Comments: map[string][]commentPopulated{
					post.ID.Hex(): []commentPopulated{},
				},
			},
		})
		return
	}

	mappedComments := populateAndMapUsers(c, comments)

	c.Status(200).JSON(respondGC{
		Success: true,
		Data: getComments{
			Post:     populatedPost,
			Comments: mappedComments,
		},
	})
}

func populateAndMapUsers(c *fiber.Ctx, comments []comment) map[string][]commentPopulated {
	mappedComments := map[string][]commentPopulated{}

	usersCollection := config.GetCollection("Users")

	for i, v := range comments {
		user := user{}

		if i == 0 {
			mappedComments[v.Post.Hex()] = []commentPopulated{}
		}

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

		if mappedComments[comment.ID.Hex()] == nil {
			mappedComments[comment.ID.Hex()] = []commentPopulated{}
		}

		if mappedComments[comment.Parent.Hex()] == nil {
			mappedComments[comment.Parent.Hex()] = []commentPopulated{}
		}

		mappedComments[comment.Parent.Hex()] = append(mappedComments[comment.Parent.Hex()], comment)
	}

	return mappedComments
}
