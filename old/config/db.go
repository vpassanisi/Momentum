package config

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func ConnectDB() *mongo.Client {
	var err error
	client, err = mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	// TODO: err could be passes to next() ????
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	return client

}

func GetCollection(str string) *mongo.Collection {

	collection := client.Database("Project-S").Collection(str)

	return collection
}
