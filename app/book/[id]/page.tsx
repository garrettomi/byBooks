import Link from "next/link";
import { formatDate } from "@/utils/formatDate";

async function getBookById(id: string) {
    const res = await fetch(`http://localhost:8000/books/${id}`, {
        cache: 'no-store',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch book')
    };

    return res.json()
};

export default async function Page ({ params }: { params: { id: string }}) {
    const bookInformation = await getBookById(params.id);

    return (
        <div className="bg-background min-h-screen p-6">
            <h1 className="text-primary text-3xl font-semibold mb-4">
            {bookInformation.title}
            </h1>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <img className="w-56 h-auto rounded mb-4" src={bookInformation.thumbnailUrl} alt={bookInformation.title}></img>
                    <h3 className="text-textPrimary text-xl font-medium mb-2">{bookInformation.title}</h3>
                    <h4 className="text-textSecondary text-lg mb-2">
                        {bookInformation.authors.map((name: string, index: number) => (
                            <span key={index}>
                                {name}{index < bookInformation.authors.length - 1 && ', '}
                            </span>
                        ))}
                    </h4>
                    <h6 className="text-textSecondary text-sm mb-4">{formatDate(bookInformation.publishedDate)}</h6>
                    <p className="text-textPrimary text-base mb-4">{bookInformation.longDescription}</p>
                </div>
                <Link className="text-secondary text-sm font-semibold" href={`/edit/${params.id}`}>
                    Edit
                </Link>
        </div>
    );
};
