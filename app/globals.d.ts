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