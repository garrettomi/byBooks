import EditBookForm from './edit-book-form/edit-book-form';

const EditBookPage = ({ params }: { params: { id: string }}) => {
    return (
        <div>
            <EditBookForm params={params} />
        </div>
    );
};

export default EditBookPage;