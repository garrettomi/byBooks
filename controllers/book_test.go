package controllers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/lib/pq"
	"github.com/omigarrett/byfood-takehome/backend/models"
	"github.com/stretchr/testify/assert"
)

func TestGetBooksController(t *testing.T) {
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
}
