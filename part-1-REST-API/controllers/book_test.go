package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gorilla/mux"
	"github.com/lib/pq"
	"github.com/omigarrett/byfood-takehome/backend/part-1-REST-API/models"
	"github.com/stretchr/testify/assert"
)

func TestGetBooksController(t *testing.T) {
	t.Run("Returns books successfully", func(t *testing.T) {
		db, mock, err := sqlmock.New()
		assert.NoError(t, err)
		defer db.Close()

		rows := sqlmock.NewRows([]string{"id", "title", "isbn", "page_count", "published_date", "thumbnail_url", "short_description", "long_description", "status", "authors", "categories"}).
			AddRow(1, "Harry Potter", "12341234", 100, nil, "http://photo.com/thumbnail.jpg", "This is a short description about a boy wizard", "This is a long description about a boy wizard", "Available", pq.Array([]string{"J.K. Rowling"}), pq.Array([]string{"Fantasy"}))

		mock.ExpectQuery("SELECT id, title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories FROM books").
			WillReturnRows(rows)

		req, err := http.NewRequest(http.MethodGet, "/books", nil)
		assert.NoError(t, err)

		rr := httptest.NewRecorder()

		handler := GetBooksController(db)

		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var books []models.Book
		err = json.NewDecoder(rr.Body).Decode(&books)
		assert.NoError(t, err)
		assert.Len(t, books, 1)
		assert.Equal(t, "Harry Potter", books[0].Title)

		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Return no books", func(t *testing.T) {
		db, mock, err := sqlmock.New()
		assert.NoError(t, err)
		defer db.Close()

		rows := sqlmock.NewRows([]string{"id", "title", "isbn", "page_count", "published_date", "thumbnail_url", "short_description", "long_description", "status", "authors", "categories"})

		mock.ExpectQuery("SELECT id, title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories FROM books").
			WillReturnRows(rows)

		req, err := http.NewRequest(http.MethodGet, "/books", nil)
		assert.NoError(t, err)

		rr := httptest.NewRecorder()

		handler := GetBooksController(db)

		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var books []models.Book
		err = json.NewDecoder(rr.Body).Decode(&books)
		assert.NoError(t, err)
		assert.Len(t, books, 0)

		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestGetBooksByIDController(t *testing.T) {
	t.Run("Returns book by ID", func(t *testing.T) {
		db, mock, err := sqlmock.New()
		assert.NoError(t, err)
		defer db.Close()

		row := sqlmock.NewRows([]string{"id", "title", "isbn", "page_count", "published_date", "thumbnail_url", "short_description", "long_description", "status", "authors", "categories"}).
			AddRow(1, "Harry Potter", "12341234", 100, nil, "http://photo.com/thumbnail.jpg", "This is a short description about a boy wizard", "This is a long description about a boy wizard", "Available", pq.Array([]string{"J.K. Rowling"}), pq.Array([]string{"Fantasy"}))

		mock.ExpectQuery("SELECT id, title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories FROM books WHERE id = \\$1").
			WithArgs(1).
			WillReturnRows(row)

		req, err := http.NewRequest(http.MethodGet, "/books/1", nil)
		assert.NoError(t, err)

		rr := httptest.NewRecorder()

		handler := GetBookByIDController(db)

		router := mux.NewRouter()
		router.HandleFunc("/books/{id}", handler)
		router.ServeHTTP(rr, req)

		var book models.Book
		err = json.NewDecoder(rr.Body).Decode(&book)
		assert.NoError(t, err)
		assert.Equal(t, "Harry Potter", book.Title)

		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestCreateBookController(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	mock.ExpectQuery(`INSERT INTO books \(title, isbn, page_count, published_date, thumbnail_url, short_description, long_description, status, authors, categories\)
        VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10\) RETURNING id`).
		WithArgs("Jurassic Park", "1234567890123", 100, nil, "thumbnail.jpg", "Short Description", "Long Description", "Available", pq.Array([]string{"Michael Crichton"}), pq.Array([]string{"Science Fiction"})).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	book := models.Book{
		Title:            "Jurassic Park",
		ISBN:             "1234567890123",
		PageCount:        100,
		PublishedDate:    nil,
		ThumbnailURL:     "thumbnail.jpg",
		ShortDescription: "Short Description",
		LongDescription:  "Long Description",
		Status:           "Available",
		Authors:          []string{"Michael Crichton"},
		Categories:       []string{"Science Fiction"},
	}
	body, _ := json.Marshal(book)
	req, err := http.NewRequest(http.MethodPost, "/books", bytes.NewBuffer(body))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()

	handler := CreateBookController(db)

	handler.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusCreated, rr.Code)

	var createdBook models.Book
	err = json.NewDecoder(rr.Body).Decode(&createdBook)
	assert.NoError(t, err)
	assert.Equal(t, "Jurassic Park", createdBook.Title)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestUpdateBookController(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	mock.ExpectExec(`UPDATE books SET title = \$1, isbn = \$2, page_count = \$3, published_date = \$4, thumbnail_url = \$5, short_description = \$6, long_description = \$7, status = \$8, authors = \$9, categories = \$10 WHERE id = \$11`).
		WithArgs("different title", "1234567890123", 100, nil, "thumbnail.jpg", "Short Description", "Long Description", "Available", pq.Array([]string{"Michael Crichton"}), pq.Array([]string{"Science Fiction"}), 1).
		WillReturnResult(sqlmock.NewResult(1, 1))

	book := models.Book{
		Title:            "different title",
		ISBN:             "1234567890123",
		PageCount:        100,
		PublishedDate:    nil,
		ThumbnailURL:     "thumbnail.jpg",
		ShortDescription: "Short Description",
		LongDescription:  "Long Description",
		Status:           "Available",
		Authors:          []string{"Michael Crichton"},
		Categories:       []string{"Science Fiction"},
	}
	body, _ := json.Marshal(book)
	req, err := http.NewRequest(http.MethodPatch, "/books/1", bytes.NewBuffer(body))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()

	handler := UpdateBookController(db)

	router := mux.NewRouter()
	router.HandleFunc("/books/{id}", handler)
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var updatedBook models.Book
	err = json.NewDecoder(rr.Body).Decode(&updatedBook)
	assert.NoError(t, err)
	assert.Equal(t, "different title", updatedBook.Title)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestDeleteBookController(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	mock.ExpectExec(`DELETE FROM books WHERE id = \$1`).WithArgs(1).WillReturnResult(sqlmock.NewResult(1, 1))

	req, err := http.NewRequest(http.MethodDelete, "/books/1", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()

	handler := DeleteBookController(db)

	router := mux.NewRouter()
	router.HandleFunc("/books/{id}", handler)
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNoContent, rr.Code)

	assert.NoError(t, mock.ExpectationsWereMet())
}
