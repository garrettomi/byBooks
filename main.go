package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	httpSwagger "github.com/swaggo/http-swagger"

	"github.com/omigarrett/byfood-takehome/backend/database"
	seed "github.com/omigarrett/byfood-takehome/backend/script"
)

// @title byFood Book Application
// @version 1.0
// @description This is the finest book application ever made
// @contact.name Garrett Omi
// @host localhost
// @BasePath /

// Initial migration if table does not exist for books
func migrate(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS books (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			isbn VARCHAR(13) NOT NULL,
			page_count INT,
			published_date TIMESTAMP,
			thumbnail_url TEXT,
			short_description TEXT,
			long_description TEXT,
			status VARCHAR(50),
			authors TEXT[],
			categories TEXT[]
		);
	`)
	return err
}

func main() {
	fmt.Println("The Best Book Application Ever")

	mux := http.NewServeMux()

	db, err := database.Connect()
	if err != nil {
		log.Fatal("Could not connect to the database: %v", err)
	}
	defer db.Close()

	err = migrate(db)
	if err != nil {
		log.Fatalf("Could not run migrations: %v", err)
	}

	err = seed.SeedDatabase(db)
	if err != nil {
		log.Fatalf("Error seeding database: %v", err)
	}

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Server is running")
	})

	mux.HandleFunc("/documentation/", httpSwagger.WrapHandler)

	if err := http.ListenAndServe("localhost:8000", mux); err != nil {
		fmt.Println(err.Error())
	}
}
