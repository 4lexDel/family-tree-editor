import { useNavigate } from "react-router-dom";
import DragComponent from "../shared/components/DragDrop/DragComponent";
import FamilyTreeService from "../familyTree/services/familyTree.service";

const ImportPage = () => {
    const navigate = useNavigate();

    const familyTreeService = new FamilyTreeService();

    const onImportClick = (files) => {  
        let filesConverted = files.map(file => {
            return familyTreeService.convertGedcomData(file.data);
        });

        console.log("FILES");
        console.log(filesConverted);

        navigate('/family', { state: {data: filesConverted[0]} });
    }

    return (
        <div className="import-page page">
            <h1 className="text-main">Import</h1>
            <DragComponent onImportClick={onImportClick} />
        </div>
    )
}

export default ImportPage;