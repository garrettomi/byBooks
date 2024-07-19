import Link from "next/link";

async function getBookById(id: string) {
    const res = await fetch(`http://localhost:8000/books/${id}`, {
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
        <div>
            Book by id
                <div>
                    <img src={bookInformation.thumbnailUrl} alt={bookInformation.title}></img>
                    <h3>{bookInformation.title}</h3>
                    <h4>
                        {bookInformation.authors.map((name: string, index: number) => (
                            <span key={index}>
                                {name}{index < bookInformation.authors.length - 1 && ', '}
                            </span>
                        ))}
                    </h4>
                    <h6>{bookInformation.publishedDate}</h6>
                    <p>{bookInformation.longDescription}</p>
                </div>
                <Link href={`/edit/${params.id}`}>
                Edit
                </Link>
        </div>
    );
};
