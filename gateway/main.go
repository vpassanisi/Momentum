package main

import (
	"fmt"
	"net/http"

	"github.com/graphql-go/handler"
	"github.com/vpassanisi/Momentum/gateway/schema"
	"github.com/vpassanisi/Momentum/gateway/util"
)

func main() {

	h := handler.New(&handler.Config{
		Schema:   &schema.Schema,
		Pretty:   true,
		GraphiQL: true,
	})

	http.Handle("/gql", h)

	fmt.Println("gateway listening on port " + util.Env.PORT)
	http.ListenAndServe(":"+util.Env.PORT, nil)
}
