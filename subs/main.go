package main

import (
	"fmt"
	"net/http"

	"github.com/vpassanisi/Momentum/subs/handlers"
	"github.com/vpassanisi/Momentum/subs/util"
)

func main() {
	http.HandleFunc("/subs", handlers.Subs)

	fmt.Printf("Subs listening on port: %s\n", util.Env.PORT)
	http.ListenAndServe(":"+util.Env.PORT, nil)
}
