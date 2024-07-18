package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/lib/pq"
	_ "github.com/lib/pq"

	_ "github.com/omigarrett/byfood-takehome/backend/docs"
	httpSwagger "github.com/swaggo/http-swagger"

	"github.com/rs/cors"

	"github.com/omigarrett/byfood-takehome/backend/database"
	seed "github.com/omigarrett/byfood-takehome/backend/script"
)

// @title byFood Book Application
// @version 1.0
// @description This is the finest book application ever made
// @contact.name Garrett Omi
// @host localhost:8000
// @BasePath /

type Book struct {
	ID               int        `json:"id"`
	Title            string     `json:"title"`
	ISBN             string     `json:"isbn"`
	PageCount        int        `json:"pageCount"`
	PublishedDate    *time.Time `json:"publishedDate"`
	ThumbnailURL     string     `json:"thumbnailUrl"`
	ShortDescription string     `json:"shortDescription"`
	LongDescription  string     `json:"longDescription"`
	Status           string     `json:"status"`
	Authors          []string   `json:"authors"`
	Categories       []string   `json:"categories"`
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

// getBooks gets all books from the database
// @Summary Get all books
// @Description Get all books from the database
// @Tags books
// @Produce json
// @Success 200 {array} Book
// @Router /books [get]
func getBooks(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories FROM books")
		if err != nil {
			http.Error(w, "Error fetching books from database", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var books []Book
		for rows.Next() {
			var book Book
			var authors, categories []string

			var publishedDate sql.NullTime

			if err := rows.Scan(&book.ID, &book.Title, &book.ISBN, &book.PageCount, &publishedDate, &book.ThumbnailURL, &book.ShortDescription, &book.LongDescription, &book.Status, pq.Array(&authors), pq.Array(&categories)); err != nil {
				log.Printf("Error scanning book data: %v", err)
				http.Error(w, "Error scanning book data", http.StatusInternalServerError)
				return
			}

			book.Authors = authors
			book.Categories = categories
			books = append(books, book)
		}

		if err := rows.Err(); err != nil {
			log.Printf("Error with rows: %v", err)
			http.Error(w, "Error with rows", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(books); err != nil {
			log.Printf("Error encoding JSON response: %v", err)
			http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		}
	}
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

	mux.HandleFunc("/documentation/*", httpSwagger.WrapHandler)
	mux.HandleFunc("/books", getBooks(db))

	//MIDDLEWARE
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := corsOptions.Handler(mux)
	if err := http.ListenAndServe("localhost:8000", handler); err != nil {
		fmt.Println(err.Error())
	}
}
