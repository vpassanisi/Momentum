package main

import (
	"fmt"
	"net/http"

	db "github.com/vpassanisi/Momentum/posts/db_posts"
	handlers "github.com/vpassanisi/Momentum/posts/handlers_posts"
	"github.com/vpassanisi/Momentum/posts/util"
)

func main() {
	db.ConnectDB()

	http.HandleFunc("/posts", handlers.Posts)
	http.HandleFunc("/newPost", handlers.NewPost)

	fmt.Printf("Posts service is listening on port: %s\n", util.Env.PORT)
	http.ListenAndServe(":"+util.Env.PORT, nil)
}
