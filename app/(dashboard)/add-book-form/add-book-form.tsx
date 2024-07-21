'use client'
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useBooks } from "@/context";
import { Book } from "../../globals";
import FormField from "./form-field";
import TextAreaField from "./text-area-field";

type Inputs = Omit<Book, 'id' | 'authors' | 'categories'> & {
    authors: string;
    categories: string;
};

export default function AddBooksForm () {
    // const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const methods = useForm<Inputs>();
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
        
        await addBook(bookData);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                <button type="submit">Add Book</button>
            </form>
        </FormProvider>
        // <form onSubmit={handleSubmit(onSubmit)}>
        //     <div>
        //         <label htmlFor="title">Title</label>
        //         <input id="title" {...register('title', { required: true })} />
        //         {errors.title && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="isbn">ISBN</label>
        //         <input id="isbn" {...register('isbn', { required: true })} />
        //         {errors.isbn && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="pageCount">Page Count</label>
        //         <input type="number" id="pageCount" {...register('pageCount', { required: true })} />
        //         {errors.pageCount && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="publishedDate">Published Date</label>
        //         <input type="date" id="publishedDate" {...register('publishedDate', { required: true })} />
        //         {errors.publishedDate && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="thumbnailUrl">Thumbnail URL</label>
        //         <input id="thumbnailUrl" {...register('thumbnailUrl', { required: true })} />
        //         {errors.thumbnailUrl && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="shortDescription">Short Description</label>
        //         <textarea id="shortDescription" {...register('shortDescription', { required: true })} />
        //         {errors.shortDescription && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="longDescription">Long Description</label>
        //         <textarea id="longDescription" {...register('longDescription', { required: true })} />
        //         {errors.longDescription && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="status">Status</label>
        //         <input id="status" {...register('status', { required: true })} />
        //         {errors.status && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="authors">Authors (comma separated)</label>
        //         <input id="authors" {...register('authors', { required: true })} />
        //         {errors.authors && <span>This field is required</span>}
        //     </div>

        //     <div>
        //         <label htmlFor="categories">Categories (comma separated)</label>
        //         <input id="categories" {...register('categories', { required: true })} />
        //         {errors.categories && <span>This field is required</span>}
        //     </div>

        //     <button type="submit">Add Book</button>
        // </form>
    );
}