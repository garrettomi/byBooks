export interface Book {
    id: number;
    title: string;
    isbn: string;
    pageCount: number;
    publishedDate: string;
    thumbnailUrl: string;
    shortDescription: string;
    longDescription: string;
    status: string;
    authors: string[];
    categories: string[];
}

export interface BooksContextType {
    books: Book[];
    // loading: boolean;
    error: string | null;
    addBook: (bookData: Omit<Book, 'id'>) => Promise<void>;
    updateBook: (id: string, bookData: Partial<Book>) => Promise<void>;
    deleteBook: (id: string) => Promise<void>;
}