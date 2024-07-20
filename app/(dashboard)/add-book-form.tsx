'use client'
import { useForm, SubmitHandler } from "react-hook-form";
import { useBooks } from "@/context";
import { Book } from "../globals";

type Inputs = Omit<Book, 'id' | 'authors' | 'categories'> & {
    authors: string;
    categories: string;
};

export default function AddBooksForm () {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const { addBook } = useBooks();

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

    //     try {
    //         const res = await fetch('http://localhost:8000/books', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(bookData),
    //         });

    //         if (!res.ok) {
    //             const errorText = await res.text();
    //             console.error('Error details:', res.status, errorText);
    //             throw new Error('Failed to add book');
    //         }

    //         const book = await res.json();
    //         console.log('Book successfully added:', book);
    //     } catch (error) {
    //         console.error('There was an error adding the book:', error);
    //     }
        await addBook(bookData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="title">Title</label>
                <input id="title" {...register('title', { required: true })} />
                {errors.title && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="isbn">ISBN</label>
                <input id="isbn" {...register('isbn', { required: true })} />
                {errors.isbn && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="pageCount">Page Count</label>
                <input type="number" id="pageCount" {...register('pageCount', { required: true })} />
                {errors.pageCount && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="publishedDate">Published Date</label>
                <input type="date" id="publishedDate" {...register('publishedDate', { required: true })} />
                {errors.publishedDate && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="thumbnailUrl">Thumbnail URL</label>
                <input id="thumbnailUrl" {...register('thumbnailUrl', { required: true })} />
                {errors.thumbnailUrl && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="shortDescription">Short Description</label>
                <textarea id="shortDescription" {...register('shortDescription', { required: true })} />
                {errors.shortDescription && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="longDescription">Long Description</label>
                <textarea id="longDescription" {...register('longDescription', { required: true })} />
                {errors.longDescription && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="status">Status</label>
                <input id="status" {...register('status', { required: true })} />
                {errors.status && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="authors">Authors (comma separated)</label>
                <input id="authors" {...register('authors', { required: true })} />
                {errors.authors && <span>This field is required</span>}
            </div>

            <div>
                <label htmlFor="categories">Categories (comma separated)</label>
                <input id="categories" {...register('categories', { required: true })} />
                {errors.categories && <span>This field is required</span>}
            </div>

            <button type="submit">Add Book</button>
        </form>
    );
}