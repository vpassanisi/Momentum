package main

import (
	"fmt"
	"net/http"

	db "github.com/vpassanisi/Momentum/subs/db_subs"
	handlers "github.com/vpassanisi/Momentum/subs/handlers_subs"
	"github.com/vpassanisi/Momentum/subs/util"
)

func main() {
	db.ConnectDB()

	http.HandleFunc("/subs", handlers.Subs)
	http.HandleFunc("/newSub", handlers.NewSub)

	fmt.Printf("Subs service is listening on port: %s\n", util.Env.PORT)
	http.ListenAndServe(":"+util.Env.PORT, nil)
}
