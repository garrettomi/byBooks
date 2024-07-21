'use client'

import { useBooks } from '@/context';
import Link from 'next/link';
import AddBooksForm from './add-book-form';

export function Dashboard() {
    const { books, error } = useBooks();

    console.log(books)

    // if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            This is the dashboard
            <AddBooksForm />
            {books.map((book) => (
                <div key={book.id}>
                    <Link href={`/book/${book.id}`}>
                        <img src={book.thumbnailUrl} alt={book.title} />
                        <h3>{book.title}</h3>
                        <h4>
                            {book.authors.map((name, index) => (
                                <span key={index}>
                                    {name}{index < book.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </h4>
                        <h6>{book.publishedDate}</h6>
                    </Link>
                </div>
            ))}
        </div>
    );
}