package seed

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/lib/pq"
)

type Book struct {
	Title            string   `json:"title"`
	ISBN             string   `json:"isbn"`
	PageCount        int      `json:"pageCount"`
	PublishedDate    *Date    `json:"publishedDate"`
	ThumbnailURL     string   `json:"thumbnailUrl"`
	ShortDescription string   `json:"shortDescription"`
	LongDescription  string   `json:"longDescription"`
	Status           string   `json:"status"`
	Authors          []string `json:"authors"`
	Categories       []string `json:"categories"`
}

type Date struct {
	Date string `json:"$date"`
}

func SeedDatabase(db *sql.DB) error {
	// Check for existing entries or duplicates
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM books").Scan(&count)
	if err != nil {
		return fmt.Errorf("Error checking for existing records: %v", err)
	}

	if count > 0 {
		fmt.Println("Database already seeded. Skipping seeding process.")
		return nil
	}

	data, err := os.ReadFile("script/books.json")
	if err != nil {
		return fmt.Errorf("Error reading JSON file: %v", err)
	}

	var books []Book
	err = json.Unmarshal(data, &books)
	if err != nil {
		return fmt.Errorf("Error parsing JSON data: %v", err)
	}

	// Neccessary since there are multiple formats of dates
	dateFormats := []string{
		time.RFC3339Nano,
		"2006-01-02T15:04:05.999-0700",
		"2006-01-02T15:04:05-0700",
	}

	for _, book := range books {
		var publishedDate time.Time
		var publishedDatePtr *time.Time

		// Necessary since some books in the JSON didn't have published dates
		if book.PublishedDate != nil && book.PublishedDate.Date != "" {
			var parseErr error
			for _, format := range dateFormats {
				publishedDate, parseErr = time.Parse(format, book.PublishedDate.Date)
				if parseErr == nil {
					publishedDatePtr = &publishedDate
					break
				}
			}
			if parseErr != nil {
				return fmt.Errorf("Error parsing date %v: %v", book.PublishedDate.Date, parseErr)
			}
		} else {
			publishedDatePtr = nil
		}

		_, err := db.Exec(
			`INSERT INTO books (title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			book.Title, book.ISBN, book.PageCount, publishedDatePtr, book.ThumbnailURL, book.ShortDescription, book.LongDescription, book.Status, pq.Array(book.Authors), pq.Array(book.Categories),
		)
		if err != nil {
			return fmt.Errorf("Error inserting book %v: %v", book, err)
		}
	}

	fmt.Println("Data seeded successfully")
	return nil
}
