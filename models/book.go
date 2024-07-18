package models

import (
	"database/sql"
	"time"

	"github.com/lib/pq"
)

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

func GetAllBooks(db *sql.DB) ([]Book, error) {
	rows, err := db.Query("SELECT id, title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories FROM books")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []Book
	for rows.Next() {
		var book Book
		var authors, categories []string
		var publishedDate sql.NullTime

		if err := rows.Scan(&book.ID, &book.Title, &book.ISBN, &book.PageCount, &publishedDate, &book.ThumbnailURL, &book.ShortDescription, &book.LongDescription, &book.Status, pq.Array(&authors), pq.Array(&categories)); err != nil {
			return nil, err
		}

		if publishedDate.Valid {
			book.PublishedDate = &publishedDate.Time
		} else {
			book.PublishedDate = nil
		}

		book.Authors = authors
		book.Categories = categories
		books = append(books, book)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return books, nil
}

func GetBooksByID(db *sql.DB, id int) (*Book, error) {
	var book Book
	var authors, categories []string
	var publishedDate sql.NullTime

	row := db.QueryRow("SELECT id, title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories FROM books WHERE id = $1", id)
	err := row.Scan(&book.ID, &book.Title, &book.ISBN, &book.PageCount, &publishedDate, &book.ThumbnailURL, &book.ShortDescription, &book.LongDescription, &book.Status, pq.Array(&authors), pq.Array(&categories))

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	if publishedDate.Valid {
		book.PublishedDate = &publishedDate.Time
	} else {
		book.PublishedDate = nil
	}

	book.Authors = authors
	book.Categories = categories

	return &book, nil
}
