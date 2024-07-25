import Link from "next/link";
import Image from "next/image";

import { validateImageSrc } from "@/utils/validateImage";
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
            <nav className="text-primary text-3xl font-semibold mb-4">
                <Link href="/" className="text-blue-600 hover:underline">
                    All Books
                </Link>
                {' / '}
                <span className="text-gray-500">{bookInformation.title}</span>
            </nav>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="relative w-56 h-72">
                        <Image
                            src={validateImageSrc(bookInformation.thumbnailUrl)}
                            alt={bookInformation.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 560px"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
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
