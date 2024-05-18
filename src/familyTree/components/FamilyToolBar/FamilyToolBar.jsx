import { AiTwotoneSave } from "react-icons/ai";
import { AiTwotoneSetting } from "react-icons/ai";
import Swal from "sweetalert2";
import { Tooltip as ReactTooltip } from "react-tooltip";


const FamilyToolBar = ({ onSaveAction }) => {
    const onSaveClick = async() => {
        const { value: filename } = await Swal.fire({
            title: "Do you want to save the changes?",
            text: "The output is a gedcom file",
            input: "text",
            inputLabel: "Your filename",
            inputValue: "my-family-tree",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            },
            confirmButtonText: "Save",
          });

        if(filename) {
            onSaveAction(filename);
        }
    }

    return (
        <div className="family-tool-bar m-0 flex flex-wrap items-center justify-start space-x-5 p-2 bg-gray-100 text-black pl-8 border-b-2">
            <div className="flex items-center space-x-1 hover:underline">
                <AiTwotoneSetting 
                    data-tooltip-id="settings-tp"
                    data-tooltip-delay-show="500"
                    className="p-1 w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer duration-500 hover:rotate-90" 
                />
            </div>  
            <ReactTooltip
                id="settings-tp"
                place="right"
                content="Settings"
            />          
            <div className="flex items-center space-x-1 hover:underline">
                <AiTwotoneSave 
                    data-tooltip-id="save-tp"
                    data-tooltip-delay-show="500"
                    onClick={onSaveClick} 
                    className="p-1 w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer duration-300 hover:scale-110" 
                />
            </div>
            <ReactTooltip
                id="save-tp"
                place="right"
                content="Save"
            /> 
    </div>
    )
}

export default FamilyToolBar;