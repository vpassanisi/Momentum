package main

import (
	"fmt"
	"net/http"

	db "github.com/vpassanisi/Momentum/comments/db_comments"
	handlers "github.com/vpassanisi/Momentum/comments/handlers_comments"
	"github.com/vpassanisi/Momentum/comments/util"
)

func main() {
	db.ConnectDB()

	http.HandleFunc("/comments", handlers.Comments)
	http.HandleFunc("/newComment", handlers.NewComment)
	http.HandleFunc("/commentsMap", handlers.CommentsMap)

	fmt.Printf("Posts service is listening on port: %s\n", util.Env.PORT)
	http.ListenAndServe(":"+util.Env.PORT, nil)
}
