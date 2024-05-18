import { useEffect, useState } from "react";
import FamilyTree from "../familyTree/components/FamilyTree/FamilyTree";
import { useLocation } from "react-router-dom";
import FamilyTreeService from "../familyTree/services/familyTree.service";
import FamilyToolBar from "../familyTree/components/FamilyToolBar/FamilyToolBar";

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
    else if(localStorage.getItem("family-data")){
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

  const onSaveAction = () => {
    console.log("SAVE");
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