import Link from "next/link";

type SuccessPopupProps = {
    message: string;
    onClose: () => void;
};

const SuccessPopup = ({ message, onClose }: SuccessPopupProps) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl mb-4">{message}</h2>
                <button onClick={onClose} className="bg-primary text-white px-4 py-2 rounded-full">
                    <Link href="/">
                        Close
                    </Link>
                </button>
            </div>
        </div>
    );
};

export default SuccessPopup;