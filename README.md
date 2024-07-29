Thank you for your interest in one the greatest book applications to come, byBooks!

Installation of byBooks is assisted by a ```Makefile``` you can find at the root level of this project containing various helper commands. Before moving on, here are the key example invocations you'll want to note: 

```
make install
make start-book-app
make stop-book-app
make start-url-service
make stop-url-service
make test-rest-api
make test-url-service
```

Furthermore, examining the contents of the ```Makefile``` may help in understanding the above commands better.

Should you happen to run into any issues with the installation process or initial set-up, please do not hesistate to reach out. 

**Installation**

As byBooks runs on 2 separate directories splitting concerns between the ```frontend``` and ```backend```, as well as a ```backend``` containing 2 functioning features (```part 1 REST API``` & ```part 2 URL Services```), we will go over set-up concerning all aspects of the project step-by-step:

**System**

System Prerequisites:

- PostgreSQL
- Golang version 1.22.5
- Swag version 1.16.3
- Node.js version 18.17 or higher

**System steps:** 

For ```byBooks```...

1. Setting up the database:
    - ```psql postgres```
    - ```CREATE USER username WITH PASSWORD 'password';```
    - ```CREATE DATABASE byfood;```
    - ```GRANT ALL PRIVILEGES ON DATABASE byfood to username;```

2. Connecting to the database: 
    - ```psql -d byfood -U username```
    - Create a ```.env``` file at the root level of ```/bybooks/backend/part-1-REST-API/```
    - Include and input values for the following DATABASE variables 
        ( ```DB_HOST```, ```DB_PORT```, ```DB_USER```, ```DB_PASSWORD```, ```DB_NAME``` )

3. Frontend ```/bybooks/frontend```
    - Create a ```.env``` file at the root level of ```/bybooks/frontend/```
    - Include and input the value referencing the localhost port of ```part-1-REST-API``` in ```NEXT_PUBLIC_BOOK_BASE_URL``` (example: ```http://localhost:8000```)

4. ```make install```

5. ```make start-book-app```
    - What this should do...
        - simultaneously starts up local ports for both frontend and backend
        - if this is the first time running, this should run the inital seeding script in ```/bybooks/backend/part-1-REST-API/script/seed.go``` utilizing the data from the parallel file books.json
        - if this is not the first time running, seeding script should be skipped
        - if ```swagger``` is not already initialized, it should initialize ```swagger``` for the backend

6. ```make stop-book-app```
    - What this should do...
        - simultaneously ends both local port instances for ```frontend``` and ```backend```

7. ```make test-rest-api``` to run backend unit tests or access ```http://localhost:8000/documentation/``` after starting the backend server to test endpoints on ```swagger```


For ```URL Service```...

1. ```make install```

2. ```make start-url-service```
    - What this should do...
        - start local port instance for URL Service
        - if ```swagger``` is not already initialized, it should initialize ```swagger``` for the backend

3. ```make stop-url-service```
    - What this should do...
        - stop local port instance for URL Service

4. ```make test-url-service``` to run backend unit tests or go to ```http://localhost:9000/documentation/``` to test endpoints on ```swagger```

**Troubleshooting & Things to Note for Bugs/Future Features**

- When starting up ```byBooks``` and accessing the frontend local port browser, occassionally there's a caching bug where the books will not display until after the browser has been refreshed.

- When inputting, updating or deleting data, there may be an initial lag reflecting between the client side cache and the data being fetched. Features work, but may require at times a hard refresh after a few seconds depending on user's network.

- The ability to input thumbnail urls is currently in a beta phase; while a value of string is required for the field, future iterations will include proper blob storage to handle images appropriately

- All initial seeded data comes from books.json utilized by the generosity of ```dudeonthehorse/datasets```. In order to access and reference the original dataset respository, please reference [here](https://github.com/dudeonthehorse/datasets/blob/master/amazon.books.json)


**Frontend Requirements...**

User Interface
- [x] Implement a dashboard that lists all books, with options to add, edit, view in detail, and
delete books.

**Dashboard**
![Screenshot of dashboard](/assets/books-dashboard-allbooks.png)

**View in detail**
![Screenshot of view in detail](/assets/view-in-detail.png)

**Delete book by id**
![Screenshot of delete](/assets/delete-book-1.png)
![Screenshot of delete 2](/assets/delete-book-2.png)

- [x] Create forms for adding new books and editing existing ones.
**Add book form**
![Screenshot of add form](/assets/add-book-1.png)
![Screenshot of add form 2](/assets/add-book-2.png)

**Edit book form**
![Screenshot of edit book](/assets/edit-book-1.png)
![Screenshot of edit book 2](/assets/edit-book-2.png)
![Screenshot of edit book 3](/assets/edit-book-3.png)

- [x] Each book entry should display basic information such as title, author, and year of
publication.
**Example of single page book displayed**
![Screenshot of basic information](/assets/view-in-detail.png)

- [x] Use modal dialogs for form submissions to enhance user experience.
**Examples of modal dialogs**
![Screenshot of modal dialogs](/assets/model-dialog-form-submissions.png)
![Screenshot of modal dialogs 2](/assets/model-dialogue-update-form.png)
![Screenshot of modal dialogs 3](/assets/add-book-1.png)

State Management
- [x] Utilize Context API to manage state across components.
Reference: ```/bybooks/frontend/context/index.tsx```

- [x] Form Handling
Reference: ```/bybooks/frontend/app/(dashboard)/add-book-form/``` && ```/bybooks/frontend/app/edit/edit-book-form/```

- [x] Include client-side validation with visual feedback for required fields.
Reference: ```/bybooks/frontend/app/(dashboard)/add-book-form/``` && ```/bybooks/frontend/app/edit/edit-book-form/```

- [x] Use controlled components for form inputs to handle form data.
Reference: ```/bybooks/frontend/context/index.tsx``` && ```/bybooks/frontend/app/(dashboard)/add-book-form/``` && ```/bybooks/frontend/app/edit/edit-book-form/```

Routing
- [x] Set up dynamic routing for viewing individual book details.
Reference: ```/bybooks/frontend/app/book/[id]/page.tsx```

Error Handling
- [x] Present user-friendly error messages for network issues and form errors.
Reference: ```/bybooks/frontend/app/not-found.tsx``` && all other ```error.tsx``` accompanying pages

**Backend Requirements...**

Part 1 - RESTful API
Develop endpoints for managing books
- [x] GET /books – Retrieve all books.
Reference: ```/bybooks/backend/part-1-REST-API/models/book.go``` && ```/bybooks/backend/part-1-REST-API/controllers/book.go``` && ```/bybooks/backend/part-1-REST-API/main.go```

- [x] POST /books – Add a new book.
Reference: ```/bybooks/backend/part-1-REST-API/models/book.go``` && ```/bybooks/backend/part-1-REST-API/controllers/book.go``` && ```/bybooks/backend/part-1-REST-API/main.go```

- [x] GET /books/{id} – Get a single book by ID.
Reference: ```/bybooks/backend/part-1-REST-API/models/book.go``` && ```/bybooks/backend/part-1-REST-API/controllers/book.go``` && ```/bybooks/backend/part-1-REST-API/main.go```

- [x] PUT /books/{id} – Update a book by ID.
Reference: ```/bybooks/backend/part-1-REST-API/models/book.go``` && ```/bybooks/backend/part-1-REST-API/controllers/book.go``` && ```/bybooks/backend/part-1-REST-API/main.go```

- [x] DELETE /books/{id} – Delete a book by ID.
Reference: ```/bybooks/backend/part-1-REST-API/models/book.go``` && ```/bybooks/backend/part-1-REST-API/controllers/book.go``` && ```/bybooks/backend/part-1-REST-API/main.go```

Database Integration (Database of your choice)
- [x] Integrate any database of your choice for data persistence.
Reference: ```/bybooks/backend/part-1-REST-API/database/db.go```

- [x] Implement queries within the Golang application to interact with the database.
Reference: ```/bybooks/backend/part-1-REST-API/database/db.go``` && ```/bybooks/backend/part-1-REST-API/scripts/seed.go```

Validation
- [x] Enforce backend validations ensuring that all fields meet certain criteria before being
processed (e.g., the title is not empty).
Reference: ```/bybooks/backend/part-1-REST-API/models/book.go``` && ```/bybooks/backend/part-1-REST-API/controllers/book.go``` && ```/bybooks/backend/part-1-REST-API/main.go```

Logging
- [x] Implement detailed logging, especially for API requests and error handling.
Reference: ```/bybooks/backend/part-1-REST-API/models/book.go``` && ```/bybooks/backend/part-1-REST-API/controllers/book.go``` && ```/bybooks/backend/part-1-REST-API/main.go```


Part 2 - URL Cleanup and Redirection Service
- [x] For a canonical URL operation, the service should process the request by
cleaning up the URL. This involves removing query parameters and trailing
slashes.
Reference: ```/bybooks/backend/part-2-url-service/main.go```

- [x] For redirection, in addition to ensuring the domain is www.byfood.com, convert
the entire URL to lowercase.
Reference: ```/bybooks/backend/part-2-url-service/main.go```

- [x] For the third option it should conduct both of the above requirements and return
the result.
Reference: ```/bybooks/backend/part-2-url-service/main.go```

API Documentation
- [x] Document each endpoint using tools like Swagger to provide an interactive API
reference.
Reerence: ```/bybooks/backend/part-1-REST-API/docs``` && ```/bybooks/backend/part-2-/url-service/docs```

Deliverables
- [x] The codebase must be hosted in a version control system with a clear commit history.
- [x] A comprehensive README.md file detailing setup instructions, project structure,
endpoint usage, and how to run tests.
- [x] Screenshots of the working application should be included in the documentation.
- [x] All installation and config scripts should ensure smooth local setup for development and
testing purposes.
- [x] Ensure comprehensive unit tests for APIs, focusing on different edge cases, and
providing test cases for the operations, by showing request and response bodies.
