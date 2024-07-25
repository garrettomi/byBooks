'use client'

import { createContext, useState, useEffect, useContext } from "react";
import { Book, BooksContextType } from "@/app/globals";

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const useBooks = () => {
    const context = useContext(BooksContext);
    if (context === undefined) {
        throw new Error ('useBooks must be used within BooksProvider');
    }
    return context;
};

export function BooksProvider ({ children } : {
    children: React.ReactNode;
}) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BOOK_BASE_URL}/books`);
                if (!res.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await res.json();
                setBooks(data);
            } catch (error: any) {
                setError(error)
                console.error("Error fetching")
            } finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);

    const addBook = async (bookData: Omit<Book, 'id'>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BOOK_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });
            if (!res.ok) {
                throw new Error('Failed to add book');
            }
            const newBook = await res.json();
            setBooks((prevBooks) => [...prevBooks, newBook]);
        } catch (error: any) {
            setError(error);
        }
    }

    const updateBook = async (id: string, bookData: Partial<Book>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BOOK_BASE_URL}/books/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });
            if (!res.ok) {
                throw new Error('Failed to update book');
            }
            const updatedBook = await res.json();
            setBooks((prevBooks) =>
                prevBooks.map((book: any) => (book.id === id ? updatedBook : book))
            );
        } catch (error: any) {
            setError(error.message);
        }
    };

    const deleteBook = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BOOK_BASE_URL}/books/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete book');
            }
            setBooks((prevBooks: any) => prevBooks.filter((book: any) => book.id !== id));
        } catch (error: any) {
            setError(error);
        }
    };

    return (
        <BooksContext.Provider
            value={{ books, loading, error, addBook, updateBook, deleteBook }}
        >
            {children}
        </BooksContext.Provider>
    );
};