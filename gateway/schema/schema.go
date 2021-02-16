package schema

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
)

var query = graphql.NewObject(graphql.ObjectConfig{
	Name: "query",
	Fields: graphql.Fields{
		"subs": &graphql.Field{
			Type: graphql.String,
			Args: graphql.FieldConfigArgument{
				"key": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				"order": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				reqBody, _ := json.Marshal(map[string]string{
					"name":  "Toby",
					"email": "Toby@example.com",
				})

				res, err := http.Post("http://users:5000/hello", "application/json", bytes.NewBuffer(reqBody))
				if err != nil {
					log.Fatalf("An Error Occured %v", err)
				}
				defer res.Body.Close()

				body, err := ioutil.ReadAll(res.Body)
				if err != nil {
					log.Fatalln(err)
				}

				if res.StatusCode != 200 {
					err = errors.New("something bad happend")
					return nil, err
				}

				return string(body), nil
			},
		},
	},
})

var mutations = graphql.NewObject(graphql.ObjectConfig{
	Name: "mutation",
	Fields: graphql.Fields{
		"register": &graphql.Field{
			Type: gqlUser,
			Args: graphql.FieldConfigArgument{
				"name": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"email": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				reqBody, err := json.Marshal(p.Args)
				if err != nil {
					return nil, err
				}

				res, err := http.Post("http://users:5000/register", "application/json", bytes.NewBuffer(reqBody))
				if err != nil {
					fmt.Println(err.Error())
					return nil, err
				}

				defer res.Body.Close()

				body, err := ioutil.ReadAll(res.Body)
				if err != nil {
					fmt.Println(err.Error())
					return nil, err
				}

				if res.StatusCode != 200 {
					err = errors.New(string(body))
					return nil, err
				}

				var parsed registerRes
				err = json.Unmarshal(body, &parsed)
				if err != nil {
					fmt.Println(err.Error())
					return nil, err
				}

				return parsed, nil
			},
		},
	},
})

var Schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query:    query,
	Mutation: mutations,
	Types: []graphql.Type{
		graphql.String,
	},
})
