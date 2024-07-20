package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

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
	fmt.Println("Server started at :9000")
	http.ListenAndServe(":9000", nil)
}
