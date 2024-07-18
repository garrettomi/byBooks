package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	"github.com/omigarrett/byfood-takehome/backend/controllers"
	"github.com/omigarrett/byfood-takehome/backend/database"
	_ "github.com/omigarrett/byfood-takehome/backend/docs"
	seed "github.com/omigarrett/byfood-takehome/backend/script"
	"github.com/rs/cors"
	httpSwagger "github.com/swaggo/http-swagger"
)

// @title byFood Book Application
// @version 1.0
// @description This is the finest book application ever made
// @contact.name Garrett Omi
// @host localhost:8000
// @BasePath /

func main() {
	fmt.Println("The Best Book Application Ever")

	router := mux.NewRouter()

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

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Server is running")
	})

	router.PathPrefix("/documentation/").Handler(httpSwagger.WrapHandler)
	router.HandleFunc("/books", controllers.GetBooksController(db)).Methods("GET")
	router.HandleFunc("/books/{id}", controllers.GetBookByIDController(db)).Methods("GET")
	router.HandleFunc("/books", controllers.CreateBookController(db)).Methods("POST")
	router.HandleFunc("/books/{id}", controllers.UpdateBookController(db)).Methods("PATCH")

	//MIDDLEWARE
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := corsOptions.Handler(router)
	if err := http.ListenAndServe("localhost:8000", handler); err != nil {
		fmt.Println(err.Error())
	}
}

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
