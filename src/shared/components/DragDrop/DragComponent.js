import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";

export default function DragComponent() {
  const [ownerLicense, setOwnerLicense] = useState([]);

  function uploadFiles(f) {
    console.log(f);
    setOwnerLicense([...ownerLicense, ...f]);
  }

  function deleteFile(indexFile) {
    const updatedList = ownerLicense.filter((ele, index) => index !== indexFile);
    setOwnerLicense(updatedList);
  }

  return (
    <div className="bg-white shadow rounded-lg px-10 pt-3 pb-5 m-5">
      <div className="pb-[8px] border-b border-[#e0e0e0]">
        <h2 className="text-black text-[17px] font-[600]">
          Drag and drop a GEDCOM file 
        </h2>
      </div>
      <CustomDragDrop
        ownerLicense={ownerLicense}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={4}
        formats={["gedcom"]}
      />
    </div>
  );
}
