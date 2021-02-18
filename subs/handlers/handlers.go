package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func Subs(w http.ResponseWriter, req *http.Request) {
	fmt.Println("fire")
	// decoder := json.NewDecoder(req.Body)

	// var data SubsReq
	// err := decoder.Decode(&data)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	test, err := json.Marshal(map[string]string{
		"testing": "123",
	})
	if err != nil {
		fmt.Println(err)
	}

	w.Write(test)
	return
}
