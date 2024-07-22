'use client'
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import { useBooks } from "@/context";
import { Book } from "../../globals";
import FormField from "./form-field";

type Inputs = Omit<Book, 'id' | 'authors' | 'categories'> & {
    authors: string;
    categories: string;
};

export default function AddBooksForm () {
    const methods = useForm<Inputs>();
    const { addBook } = useBooks();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const bookData = {
            ...data,
            pageCount: parseInt(data.pageCount as unknown as string, 10),
            authors: data.authors.split(',').map((author) => author.trim()),
            categories: data.categories.split(',').map((category) => category.trim()),
        };

        if (bookData.publishedDate) {
            bookData.publishedDate = new Date(bookData.publishedDate).toISOString();
        }
        
        await addBook(bookData);
        setSuccessMessage("Successfully added book!");
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-md p-4 flex flex-wrap gap-4 mb-6">
                <FormField id="title" label="Title" required />
                <FormField id="isbn" label="ISBN" required />
                <FormField id="pageCount" label="Page Count" type="number" required />
                <FormField id="publishedDate" label="Published Date" type="date" required />
                <FormField id="thumbnailUrl" label="Thumbnail URL" required />
                <FormField id="shortDescription" label="Short Description" required />
                <FormField id="longDescription" label="Long Description" required />
                <FormField id="status" label="Status" required />
                <FormField id="authors" label="Authors (separate by commas if multiple)" required />
                <FormField id="categories" label="Categories (separate by commas if multiple)" required />
                <div className="ml-5 mt-6">
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-full">Add Book</button>
                </div>
            </form>
            {successMessage && (
                <div>
                    {successMessage}
                </div>
            )}
        </FormProvider>
    );
}