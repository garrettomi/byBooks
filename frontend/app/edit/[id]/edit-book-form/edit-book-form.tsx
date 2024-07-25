'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/context';
import FormField from './form-field';
import DeleteButton from './delete-button';


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
                pageCount: book.pageCount,
                publishedDate: book.publishedDate,
                shortDescription: book.shortDescription,
                longDescription: book.longDescription,
                thumbnailUrl: book.thumbnailUrl,
                status: book.status,
                categories: book.categories.join(', ')
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
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 flex flex-wrap gap-4 mb-6">
            <FormField label="Title" name="title" value={formData.title} onChange={handleChange} />
            <FormField label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} />
            <FormField label="Page Count" name="pageCount" value={formData.pageCount} onChange={handleChange} />
            <FormField label="Authors" name="authors" value={formData.authors} onChange={handleChange} />
            <FormField label="Published Date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} />
            <FormField label="Thumbnail URL" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} />
            <FormField label="Short Description" name="shortDescription" value={formData.shortDescription} onChange={handleChange} isTextArea/>
            <FormField label="Long Description" name="longDescription" value={formData.longDescription} onChange={handleChange} isTextArea />
            <FormField label="Status" name="status" value={formData.status} onChange={handleChange} />
            <FormField label="Categories" name="categories" value={formData.categories} onChange={handleChange} />
            <div>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-full">Update Book</button>
                <DeleteButton bookId={params.id} />
            </div>
        </form>
    );
};

export default EditBookForm;
