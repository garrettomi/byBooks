'use client'

import Link from 'next/link';
import Image from 'next/image';

import { useBooks } from '@/context';
import { formatDate } from '@/utils/formatDate';
import { validateImageSrc } from '@/utils/validateImage';
import AddBooksForm from './add-book-form/add-book-form';

export function Dashboard() {
    const { books, error } = useBooks();

    // if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-background min-h-screen p-6">
            <h1 className="text-primary text-3xl front-semibold mb-4">
            Books by Books
            </h1>
            <AddBooksForm />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {books.map((book) => (
                    <div key={book.id} className="bg-white rounded-lg shadow-md p-2">
                        <Link href={`/book/${book.id}`} className="block">
                                <div className="relative inset-0 z-0 h-auto min-h-[200px]">
                                    <Image 
                                        src={validateImageSrc(book.thumbnailUrl)}
                                        alt={book.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 560px"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <h3 className="text-textPrimary text-sm font-medium">{book.title}</h3>
                                <h4 className="text-textSecondary text-xs">
                                    {book.authors.map((name, index) => (
                                        <span key={index}>
                                            {name}{index < book.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </h4>
                                <h6 className="text-textSecondary text-xs">{formatDate(book.publishedDate)}</h6>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}