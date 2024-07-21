import EditBookForm from './edit-book-form/edit-book-form';
import DeleteButton from './edit-book-form/delete-button';

const EditBookPage = ({ params }: { params: { id: string }}) => {
    return (
        <div>
            <h1>Edit Book</h1>
            <EditBookForm params={params} />
            <DeleteButton bookId={params.id} />
        </div>
    );
};

export default EditBookPage;