import { useNavigate } from "react-router-dom";
import DragComponent from "../shared/components/DragDrop/DragComponent";

const ImportPage = () => {
    const navigate = useNavigate();

    const onImportClick = (files) => {
        console.log("FILES");
        console.log(files);

        navigate('/family', { state: {data: files[0]} });
    }

    return (
        <div className="import-page page">
            <h1 className="text-main">Import</h1>
            <DragComponent onImportClick={onImportClick} />
        </div>
    )
}

export default ImportPage;