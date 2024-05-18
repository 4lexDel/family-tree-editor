import { AiTwotoneSave } from "react-icons/ai";
import { AiTwotoneSetting } from "react-icons/ai";


const FamilyToolBar = ({ onSaveAction }) => {
    const onSaveClick = () => {
        
    }

    return (
        <div className="family-tool-bar m-0 flex flex-wrap items-center justify-start space-x-5 p-2 bg-gray-100 text-black pl-8 border-b-2">
            <div className="flex items-center space-x-1 hover:underline">
                <AiTwotoneSetting className="p-1 w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer duration-500 hover:rotate-90" />
            </div>            
            <div className="flex items-center space-x-1 hover:underline">
                <AiTwotoneSave onClick={onSaveClick} className="p-1 w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer duration-300 hover:scale-110" />
            </div>
        </div>
    )
}

export default FamilyToolBar;