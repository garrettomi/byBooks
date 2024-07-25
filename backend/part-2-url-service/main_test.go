package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCleanURL(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"https://example.com/path/to/resource?query=123#fragment", "https://example.com/path/to/resource"},
		{"https://example.com/path/to/resource/", "https://example.com/path/to/resource"},
		{"https://example.com/path/to/resource", "https://example.com/path/to/resource"},
	}

	for _, test := range tests {
		output, err := cleanURL(test.input)
		if err != nil {
			t.Errorf("cleanURL(%s) returned error: %v", test.input, err)
		}

		if output != test.expected {
			t.Errorf("cleanURL(%s) = %s; want %s", test.input, output, test.expected)
		}
	}
}

func TestRedirectURL(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"https://example.com/path/to/resource?query=123#fragment", "https://www.byfood.com/path/to/resource"},
		{"http://example.com/path/to/resource/", "https://www.byfood.com/path/to/resource"},
		{"https://example.com/path/to/resource", "https://www.byfood.com/path/to/resource"},
	}

	for _, test := range tests {
		output, err := redirectURL(test.input)
		if err != nil {
			t.Errorf("redirectURL(%s) returned error: %v", test.input, err)
		}

		if output != test.expected {
			t.Errorf("redirectURL(%s) = %s; want %s", test.input, output, test.expected)
		}
	}
}

func TestProcessedURLHandler(t *testing.T) {
	tests := []struct {
		reqBody  Request
		respBody Response
		status   int
	}{
		{Request{URL: "https://example.com/path/to/resource?query=123#fragment", Operation: "canonical"}, Response{ProcessedURL: "https://example.com/path/to/resource"}, http.StatusOK},
		{Request{URL: "https://example.com/path/to/resource?query=123#fragment", Operation: "redirection"}, Response{ProcessedURL: "https://www.byfood.com/path/to/resource"}, http.StatusOK},
		{Request{URL: "https://example.com/path/to/resource?query=123#fragment", Operation: "all"}, Response{ProcessedURL: "https://www.byfood.com/path/to/resource"}, http.StatusOK},
		{Request{URL: "https://example.com/path/to/resource?query=123#fragment", Operation: "invalid"}, Response{}, http.StatusBadRequest},
	}

	for _, test := range tests {
		reqBody, _ := json.Marshal(test.reqBody)
		req, err := http.NewRequest("POST", "/process-url", bytes.NewBuffer(reqBody))
		if err != nil {
			t.Fatal(err)
		}
		rr := httptest.NewRecorder()
		handler := http.HandlerFunc(processURL)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != test.status {
			t.Errorf("handler returned wrong status code: got %v but wanted %v", status, test.status)
		}

		if test.status == http.StatusOK {
			var resp Response
			err := json.NewDecoder(rr.Body).Decode(&resp)
			if err != nil {
				t.Errorf("error decoding response: %v", err)
			}

			if resp.ProcessedURL != test.respBody.ProcessedURL {
				t.Errorf("handler returned unexpected body: got %v but wanted %v", resp.ProcessedURL, test.respBody.ProcessedURL)
			}
		}
	}
}
