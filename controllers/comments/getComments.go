package comments

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber"
	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetComments //
// @desc gets the post and comments for a given id
// @route GET /api/v1/comments/?postID&sort&order
// @access Public
func GetComments(c *fiber.Ctx) {

	post := post{}
	comments := []comment{}

	postID, idErr := primitive.ObjectIDFromHex(c.Query("postID"))
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
	repliesCollection := config.GetCollection("Replies")

	findOneErr := postsCollection.FindOne(c.Context(), bson.M{
		"_id": postID,
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

	order := 1

	if c.Query("order") == "-1" {
		order = -1
	}

	opts := options.Find().SetSort(bson.D{{c.Query("sort"), order}})

	commentsCursor, findErr := commentsCollection.Find(c.Context(), bson.M{
		"post": post.ID,
	}, opts)
	if findErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during query",
		})

		fmt.Println(findErr)
		return
	}

	// loop through cursor and put comments in the slice
	cursorErr := commentsCursor.All(c.Context(), &comments)
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
				Comments: map[string][]interface{}{
					post.ID.Hex(): []interface{}{},
				},
			},
		})
		return
	}

	arr := bson.A{}

	for _, v := range comments {
		arr = append(arr, bson.M{"comment": v.ID})
	}

	filter := bson.M{
		"$or": arr,
	}

	replies := []reply{}

	repliesCursor, repliesErr := repliesCollection.Find(c.Context(), filter, opts)
	if repliesErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during query",
		})
		fmt.Println(repliesErr)
		return
	}

	repliesCursorErr := repliesCursor.All(c.Context(), &replies)
	if repliesCursorErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	mappedComments := populateUsersAndMap(c, comments)

	c.Status(200).JSON(respondGC{
		Success: true,
		Data: getComments{
			Post:     populatedPost,
			Comments: mappedComments,
		},
	})
}

func populateUsersAndMap(c *fiber.Ctx, comments []comment) map[string][]interface{} {
	mappedComments := map[string][]interface{}{}

	usersCollection := config.GetCollection("Users")

	for i, v := range comments {
		user := user{}

		if i == 0 {
			mappedComments[v.Post.Hex()] = []interface{}{}
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
			mappedComments[comment.ID.Hex()] = []interface{}{}
		}

		if mappedComments[comment.Parent.Hex()] == nil {
			mappedComments[comment.Parent.Hex()] = []interface{}{}
		}

		mappedComments[comment.Parent.Hex()] = append(mappedComments[comment.Parent.Hex()], comment)
	}

	return mappedComments
}
