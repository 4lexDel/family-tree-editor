import FamilyTreeService from "../../../familyTree/services/familyTree.service";
import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";

export default function DragComponent() {
  const [files, setFiles] = useState([]);

  const familyTreeService = new FamilyTreeService();

  function uploadFiles(f) {
    setFiles([...files, ...f]);
  }

  function deleteFile(indexFile) {
    const updatedList = files.filter((ele, index) => index !== indexFile);
    setFiles(updatedList);
  }

  function importFiles() {
    files.forEach(file => {
      console.log(file.data);
      let convertData = familyTreeService.convertGedcomData(file.data);
      console.log("-------------------");
      console.log(convertData);
      console.log("-------------------");
    });
  }

  return (
    <div className="bg-white shadow rounded-lg px-10 pt-3 pb-5 m-8">
      <div className="pb-[8px] border-b border-[#e0e0e0]">
        <h2 className="text-black text-[17px] font-[600]">
          Drag and drop a GEDCOM file 
        </h2>
      </div>
      <CustomDragDrop
        ownerLicense={files}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={4}
        formats={["gedcom"]}
      />

      <button onClick={importFiles} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded">
        Import files
      </button>
    </div>
  );
}
