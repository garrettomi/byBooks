package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/omigarrett/byfood-takehome/backend/models"
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
