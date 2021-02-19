package db

import (
	"context"
	"log"
	"time"

	"github.com/vpassanisi/Momentum/subs/util"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func ConnectDB() {
	var err error
	Client, err = mongo.NewClient(options.Client().ApplyURI(util.Env.MONGO_URI))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	err = Client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
}
