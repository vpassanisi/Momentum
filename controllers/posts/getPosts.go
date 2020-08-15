package posts

import (
	"fmt"
	"log"

	"github.com/vpassanisi/Project-S/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/gofiber/fiber"
)

// GetPosts //
// @desc gets all posts in a sub and sorts them based on query params
// @route GET /api/v1/posts/:sub
// @access Public
func GetPosts(c *fiber.Ctx) {

	posts := []post{}
	sub := subFull{}

	postsCollection := config.GetCollection("Posts")
	subsCollection := config.GetCollection("Subs")

	findOneErr := subsCollection.FindOne(c.Context(), bson.M{
		"name": c.Params("sub"),
	}).Decode(&sub)
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

	cursor, findErr := postsCollection.Find(c.Context(), bson.M{
		"sub": sub.ID,
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
	cursorErr := cursor.All(c.Context(), &posts)
	if cursorErr != nil {
		c.Status(500).JSON(respondM{
			Success: false,
			Message: "There was an error during cursor loop",
		})
		return
	}

	populatedPosts := populateUsers(c, posts)

	c.Status(200).JSON(respondGP{
		Success: true,
		Data: getPosts{
			Sub:   sub,
			Posts: populatedPosts,
		},
	})

}

func populateUsers(c *fiber.Ctx, posts []post) []postPopulated {
	var populatedPosts []postPopulated

	usersCollection := config.GetCollection("Users")

	for _, v := range posts {
		user := user{}

		post := postPopulated{
			ID:        v.ID,
			Body:      v.Body,
			Title:     v.Title,
			Sub:       v.Sub,
			Points:    v.Points,
			CreatedAt: v.CreatedAt,
		}

		findOneErr := usersCollection.FindOne(c.Context(), bson.M{
			"_id": v.User,
		}).Decode(&user)
		if findOneErr != nil {
			log.Fatal(findOneErr)
		}

		post.User = user

		populatedPosts = append(populatedPosts, post)
	}

	return populatedPosts
}
