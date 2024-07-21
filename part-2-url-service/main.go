package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	_ "github.com/omigarrett/byfood-takehome/backend/part-2-url-service/docs"
	httpSwagger "github.com/swaggo/http-swagger"
)

// @title URL Cleanup and Redirection
// @version 1.0
// @description This is a URL cleanup and redirector
// @contact.name Garrett Omi
// @host localhost:9000
// @BasePath /

type Request struct {
	URL       string `json:"url"`
	Operation string `json:"operation"`
}

type Response struct {
	ProcessedURL string `json:"processed_url"`
}

func cleanURL(rawURL string) (string, error) {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}
	parsedURL.RawQuery = ""
	parsedURL.Fragment = ""
	parsedURL.Path = strings.TrimSuffix(parsedURL.Path, "/")
	return parsedURL.String(), nil
}

func redirectURL(rawURL string) (string, error) {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}
	parsedURL.Host = "www.byfood.com"
	parsedURL.Scheme = "https"
	parsedURL.RawQuery = ""
	parsedURL.Fragment = ""
	parsedURL.Path = strings.TrimSuffix(parsedURL.Path, "/")
	return strings.ToLower(parsedURL.String()), nil
}

// processURL godoc
// @Summary Process URL
// @Description Clean up and redirect URL based on operation type
// @Accept  json
// @Produce  json
// @Param   request  body  Request  true  "URL and Operation"
// @Success 200 {object} Response
// @Failure 400 {string} string "Invalid request payload"
// @Failure 500 {string} string "Error processing URL"
// @Router /process-url [post]
func processURL(w http.ResponseWriter, r *http.Request) {
	var req Request
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	var processedURL string
	switch req.Operation {
	case "canonical":
		processedURL, err = cleanURL(req.URL)
	case "redirection":
		processedURL, err = redirectURL(req.URL)
	case "all":
		canonicalURL, err := cleanURL(req.URL)
		if err == nil {
			processedURL, err = redirectURL(canonicalURL)
		}
	default:
		http.Error(w, "Invalid operation type", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "Error processing URL", http.StatusInternalServerError)
		return
	}

	res := Response{ProcessedURL: processedURL}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func main() {
	http.HandleFunc("/process-url", processURL)
	http.HandleFunc("/documentation/", httpSwagger.WrapHandler)
	fmt.Println("Server started at :9000")
	http.ListenAndServe(":9000", nil)
}
