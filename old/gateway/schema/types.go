package schema

import "github.com/graphql-go/graphql"

type registerRes struct {
	ID        string `json:"_id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	CreatedAt int32  `json:"createdAt"`
	Token     string `json:"token"`
}

var gqlUser = graphql.NewObject(graphql.ObjectConfig{
	Name: "gqlUser",
	Fields: graphql.Fields{
		"_id": &graphql.Field{
			Type: graphql.String,
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
		"email": &graphql.Field{
			Type: graphql.String,
		},
		"createdAt": &graphql.Field{
			Type: graphql.Int,
		},
	},
})
