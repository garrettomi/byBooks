'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/context';

export default function EditBookPage({ params }: { params: { id: string }}) {
    const { books, updateBook, deleteBook } = useBooks();
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
        const bookId = Number(params.id);
        const book = books.find((book: any) => book.id === bookId);
        if (book) {
            setFormData({
                title: book.title,
                isbn: book.isbn,
                authors: book.authors.join(', '),
                publishedDate: book.publishedDate,
                longDescription: book.longDescription,
                thumbnailUrl:book.thumbnailUrl
            })
        }
    }, [books, params.id]);

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

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this book?");

        if (confirmed) {
            try {
                await deleteBook(params.id);
                router.push('/');
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (!formData.title) {
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
            <button onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
                Delete Book
            </button>
        </div>
    );
}