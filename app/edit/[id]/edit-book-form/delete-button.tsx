'use client'

import { useRouter } from 'next/navigation';
import { useBooks } from '@/context';

const DeleteButton = ({ bookId }: { bookId: string }) => {
    const { deleteBook } = useBooks();
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this book?");

        if (confirmed) {
            try {
                await deleteBook(bookId);
                router.push('/');
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <button onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
            Delete Book
        </button>
    );
};

export default DeleteButton;
