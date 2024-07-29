'use client'

import { useBooks } from '@/context';

const DeleteButton = ({ bookId, setSuccessMessage }: { bookId: string, setSuccessMessage: (message: string) => void  }) => {
    const { deleteBook } = useBooks();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this book?");

        if (confirmed) {
            try {
                await deleteBook(bookId);
                setSuccessMessage("Successfully deleted book!");
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <button onClick={handleDelete} className="bg-accent text-white px-4 py-2 rounded-full">
            Delete Book
        </button>
    );
};

export default DeleteButton;
