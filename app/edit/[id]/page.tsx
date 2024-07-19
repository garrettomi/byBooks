'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function getBookById(id: string) {
    const res = await fetch(`http://localhost:8000/books/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch book');
    }

    return res.json();
}

async function updateBook(id: string, bookData: any) {
    const res = await fetch(`http://localhost:8000/books/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });

    if (!res.ok) {
        throw new Error('Failed to update book');
    }

    return res.json();
}

export default function EditBookPage({ params }: { params: { id: string }}) {
    const [book, setBook] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        title: '',
        isbn: '',
        authors: '',
        publishedDate: '',
        longDescription: '',
        thumbnailUrl: ''
    });

    const router = useRouter();

    useEffect(() => {
        async function fetchBook() {
            try {
                const bookData = await getBookById(params.id);
                setBook(bookData);
                setFormData({
                    title: bookData.title,
                    isbn: bookData.isbn,
                    authors: bookData.authors.join(', '),
                    publishedDate: bookData.publishedDate,
                    longDescription: bookData.longDescription,
                    thumbnailUrl: bookData.thumbnailUrl
                });
            } catch (error) {
                console.error(error);
            }
        }

        fetchBook();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateBook(params.id, {
                ...formData,
                authors: formData.authors.split(',').map((author: string) => author.trim())
            });
            router.push(`/book/${params.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Book</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>ISBN</label>
                    <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Authors</label>
                    <input
                        type="text"
                        name="authors"
                        value={formData.authors}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Published Date</label>
                    <input
                        type="text"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Long Description</label>
                    <textarea
                        name="longDescription"
                        value={formData.longDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label>Thumbnail URL</label>
                    <input
                        type="text"
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Book</button>
            </form>
        </div>
    );
}