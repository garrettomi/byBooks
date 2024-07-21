'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/context';
import FormField from './form-field';


const EditBookForm = ({ params }: { params: { id: string }}) => {
    const { books, updateBook } = useBooks();
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
                thumbnailUrl: book.thumbnailUrl
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

    if (!formData.title) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormField label="Title" name="title" value={formData.title} onChange={handleChange} />
            <FormField label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} />
            <FormField label="Authors" name="authors" value={formData.authors} onChange={handleChange} />
            <FormField label="Published Date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} />
            <FormField label="Long Description" name="longDescription" value={formData.longDescription} onChange={handleChange} isTextArea />
            <FormField label="Thumbnail URL" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} />
            <button type="submit">Update Book</button>
        </form>
    );
};

export default EditBookForm;
