import { useEffect, useState } from "react";
import FamilyTree from "../familyTree/components/FamilyTree/FamilyTree";
import { useLocation } from "react-router-dom";
import FamilyTreeService from "../familyTree/services/familyTree.service";
import FamilyToolBar from "../familyTree/components/FamilyToolBar/FamilyToolBar";
import Swal from "sweetalert2";

const FamilyPage = () => {
  const location = useLocation();

  const familyTreeService = new FamilyTreeService();

  const [data, setData] = useState(null);

  useEffect(() => {
    const dataRetrieved = location.state?.data;

    if(dataRetrieved){
      setData(dataRetrieved);
      localStorage.setItem("family-data", JSON.stringify(dataRetrieved));
    }
    else if(false && localStorage.getItem("family-data")){
      setData(JSON.parse(localStorage.getItem("family-data")));
    }
    else {
      const defaultData = familyTreeService.getDefaultFamilyTree();
      setData(defaultData);
      localStorage.setItem("family-data", JSON.stringify(defaultData));
    }
  }, []);

  const onDataUpdated = (newData) => {
    setData(newData);
  }

  const onSaveAction = (filename) => {
    !filename.endsWith('.gedcom') && (filename += ".gedcom");

    let result = familyTreeService.createGedcomData(data);

    downloadFile(result, filename);

    Swal.fire(filename+" saved successfully!", "", "success");
  }

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  return (
    <div className='family-page m-0'>
      <FamilyToolBar onSaveAction={onSaveAction} />
      <h1 className="text-main">Family tree</h1>

      <FamilyTree data={data} onDataUpdated={onDataUpdated}></FamilyTree>
    </div>
  );
}

export default FamilyPage;



// QUAND EDITEUR ==> DONNER UN USESATE POUR GARDER LE DERNIER ETAT // OU CALLBACK AVEC ARG ?