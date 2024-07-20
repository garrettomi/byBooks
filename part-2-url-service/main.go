package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "URL clean up and redirection service")
	})
	fmt.Println("Server started at :9000")
	http.ListenAndServe(":9000", nil)
}
