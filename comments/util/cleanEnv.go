package util

import (
	"fmt"
	"os"
	"reflect"
)

type cleanEnv struct {
	PORT      string
	MONGO_URI string
}

func getCleanEnv(specs cleanEnv) cleanEnv {
	fields := reflect.ValueOf(specs)
	keys := reflect.TypeOf(specs)

	num := fields.NumField()

	for i := 0; i < num; i++ {
		field := fields.Field(i)
		if field.String() == "" {
			fmt.Println("environment: " + keys.Field(i).Name + " unset")
			os.Exit(1)
		}
	}
	return specs
}

var Env = getCleanEnv(cleanEnv{
	PORT:      os.Getenv("PORT"),
	MONGO_URI: os.Getenv("MONGO_URI"),
})
