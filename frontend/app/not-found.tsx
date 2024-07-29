import Link from "next/link";

export default async function NotFound() {
    return (
        <>
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-primary text-4xl text-center">Whoops, seems like this page can't be found</h2>
            <div className="mt-10">
                <button className="p-2 bg-secondary text-white rounded-full">
                    <Link href="/">
                    Go back to home
                    </Link>
                </button>
            </div>
        </div>
        </>
    )
}