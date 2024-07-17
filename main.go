package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/omigarrett/byfood-takehome/backend/database"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
}

func main() {
	db, err := database.Connect()
	if err != nil {
		log.Fatal("Could not connect to the database: %v", err)
	}
	defer db.Close()

	http.HandleFunc("/", handler)
	http.ListenAndServe(":8000", nil)
}
