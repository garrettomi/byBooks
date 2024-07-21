'use client'

import { useBooks } from '@/context';
import Link from 'next/link';
import AddBooksForm from './add-book-form';

export function Dashboard() {
    const { books, error } = useBooks();

    console.log(books)

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-background min-h-screen p-6">
            <h1 className="text-primary text-3xl front-semibold mb-4">
            Dashboard
            </h1>
            <AddBooksForm />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {books.map((book) => (
                    <div key={book.id} className="bg-white rounded-lg shadow-md p-2">
                        <Link href={`/book/${book.id}`} className="block">
                                <img className="w-full h-auto rounded mb-2" src={book.thumbnailUrl} alt={book.title} />
                                <h3 className="text-textPrimary text-sm font-medium">{book.title}</h3>
                                <h4 className="text-textSecondary text-xs">
                                    {book.authors.map((name, index) => (
                                        <span key={index}>
                                            {name}{index < book.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </h4>
                                <h6 className="text-textSecondary text-xs">{book.publishedDate}</h6>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}