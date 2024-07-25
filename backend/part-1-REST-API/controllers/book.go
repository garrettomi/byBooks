package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/omigarrett/byfood-takehome/backend/part-1-REST-API/models"
)

// GetBooksController handles the request for fetching all books
// @Summary Get all books
// @Description Get all books from the database
// @Tags books
// @Produce json
// @Success 200 {array} models.Book
// @Router /books [get]
func GetBooksController(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		books, err := models.GetAllBooks(db)
		if err != nil {
			http.Error(w, "Error fetching books from database", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(books); err != nil {
			http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		}
	}
}

// GetBookByIDController handles the request for fetching a book by its ID
// @Summary Get book by ID
// @Description Get a book by its ID from the database
// @Tags books
// @Produce json
// @Param id path int true "Book ID"
// @Success 200 {object} models.Book
// @Router /books/{id} [get]
func GetBookByIDController(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid book ID", http.StatusBadRequest)
			return
		}

		book, err := models.GetBooksByID(db, id)
		if err != nil {
			http.Error(w, "Error fetching book from database", http.StatusInternalServerError)
			return
		}
		if book == nil {
			http.Error(w, "Book not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(book); err != nil {
			http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		}
	}
}

// CreateBookController handles the request for creating a new book
// @Summary Create a new book
// @Description Create a new book in the database
// @Tags books
// @Accept json
// @Produce json
// @Param book body models.Book true "Book"
// @Success 201 {object} models.Book
// @Router /books [post]
func CreateBookController(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var book models.Book

		err := json.NewDecoder(r.Body).Decode(&book)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		if book.PublishedDate != nil {
			var parsedDate time.Time
			dateFormats := []string{
				time.RFC3339,
				"2006-01-02",
				"02 Jan 2006",
				"January 2, 2006",
			}
			for _, format := range dateFormats {
				parsedDate, err = time.Parse(format, book.PublishedDate.Format(format))
				if err == nil {
					book.PublishedDate = &parsedDate
					break
				}
			}
			if err != nil {
				http.Error(w, "Invalid date format", http.StatusBadRequest)
				return
			}
		}

		err = models.CreateBook(db, &book)
		if err != nil {
			http.Error(w, "Error creating book", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(book)
	}
}

// UpdateBookController handles the request for updating a book by its ID
// @Summary Update a book
// @Description Update a book by its ID in the database
// @Tags books
// @Accept json
// @Produce json
// @Param id path int true "Book ID"
// @Param book body models.Book true "Book"
// @Success 200 {object} models.Book
// @Router /books/{id} [patch]
func UpdateBookController(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid book ID", http.StatusBadRequest)
			return
		}

		var book models.Book
		err = json.NewDecoder(r.Body).Decode(&book)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		book.ID = id

		if book.PublishedDate != nil {
			parsedDate, err := time.Parse(time.RFC3339, book.PublishedDate.Format(time.RFC3339))
			if err != nil {
				http.Error(w, "Invalid date format", http.StatusBadRequest)
				return
			}
			book.PublishedDate = &parsedDate
		}

		err = models.UpdateBook(db, &book)
		if err != nil {
			http.Error(w, "Error updating book", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(book)
	}
}

// DeleteBookController handles the request for deleting a book by its ID
// @Summary Delete a book
// @Description Delete a book by its ID from the database
// @Tags books
// @Param id path int true "Book ID"
// @Success 204 "No Content"
// @Router /books/{id} [delete]
func DeleteBookController(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid book ID", http.StatusBadRequest)
			return
		}

		err = models.DeleteBook(db, id)
		if err != nil {
			http.Error(w, "Error deleting book", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
