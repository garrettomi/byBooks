import Link from "next/link";

export default async function NotFound() {
    return (
        <>
            <h2>Whoops, seems like this page can't be found</h2>
            <button>
                <Link href="/">
                Go back to home
                </Link>
            </button>
        </>
    )
}