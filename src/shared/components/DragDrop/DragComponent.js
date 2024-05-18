import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Swal from "sweetalert2";


export default function DragComponent({ onImportClick }) {
  const [files, setFiles] = useState([]);

  function uploadFiles(f) {
    setFiles([...files, ...f]);
  }

  function deleteFile(indexFile) {
    const updatedList = files.filter((ele, index) => index !== indexFile);
    setFiles(updatedList);
  }

  function importFiles() {
    if(!files.length) {
      Swal.fire("No files imported", "", "warning");
    }
    else {
      onImportClick(files);
      TopNotification.fire({
        icon: "success",
        title: "File(s) imported successfully"
      });
    }
  }

  const TopNotification = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
  });

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
        count={1}
        formats={["gedcom"]}
      />

      <button 
        data-tooltip-id="import-tp" 
        data-tooltip-delay-show="500"
        onClick={importFiles} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded">
        Import file(s)
      </button>
      <ReactTooltip
          id="import-tp"
          place="top"
          content="Import the file(s) and visualize the family tree structure"
      />   
    </div>
  );
}
