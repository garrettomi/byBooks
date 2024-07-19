import { Book } from "../globals";

async function getBooks() {
    const res = await fetch('http://localhost:8000/books', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch books')
    }

    return res.json()
}

export async function Dashboard () {
    const books = await getBooks();

    return (
        <div>
            This is the dashboard
            {books.map((book: Book) => (
                <div key={book.id}>
                    <img src={book.thumbnailUrl} alt={book.title}></img>
                    <h3>{book.title}</h3>
                    <h4>
                        {book.authors.map((name: string, index: number) => (
                            <span key={index}>
                                {name}{index < book.authors.length - 1 && ', '}
                            </span>
                        ))}
                    </h4>
                    <h6>{book.publishedDate}</h6>
                </div>
            ))
            }
        </div>
    )
}