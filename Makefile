.PHONY: start-book-app stop-book-app generate-swagger-rest-api generate-swagger-url-service prepare-version start-url-service stop-url-service install-backend-part-1-rest-api install-backend-part-2-url-service install-frontend 

start-book-app: generate-swagger-rest-api
	cd frontend && npm run dev &
	cd backend/part-1-rest-api && go run main.go &

stop-book-app:
	- pkill -f "npm run dev" || true
	- pkill -f "go run main.go" || true

start-url-service: generate-swagger-url-service
	cd backend/part-2-url-service && go run main.go &

stop-url-service:
	- pkill -f "go run main.go" || true

# BEFORE RUNNING PLEASE ENSURE POSTGRESQL DATABASE & .env FILES ARE SET UP AS REQUIRED
install: install-backend-part-1-rest-api install-backend-part-2-url-service install-frontend

install-backend-part-1-rest-api:
	@echo "Installing backend dependencies for rest api..."
	cd backend/part-1-rest-api && \
		[ ! -f go.mod ] && go mod init || true && \
		go install github.com/swaggo/swag/cmd/swag@v1.16.3 && \
		echo "Backend installation complete"

install-backend-part-2-url-service:
	@echo "Installing backend dependencies for url service..."
	cd backend/part-2-url-service && \
		[ ! -f go.mod ] && go mod init || true && \
		echo "Url Service installation complete"

install-frontend:
	@echo "Installing frontend dependencies"
	cd frontend && npm install

generate-swagger-rest-api:
	cd backend/part-1-rest-api && $(shell go env GOPATH)/bin/swag init

generate-swagger-url-service:
	cd backend/part-2-url-service && $(shell go env GOPATH)/bin/swag init