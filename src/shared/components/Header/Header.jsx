import { Link } from 'react-router-dom';
import './header.css'
import { FaHome, FaFileImport, FaUsers } from 'react-icons/fa';


const Header = () => {
  return (
    <div className="header flex flex-wrap items-center justify-end space-x-10 p-4 bg-gray-800 text-white pr-8">
      <Link to="/home" className="flex items-center space-x-1 hover:underline">
        <FaHome className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-sm md:text-base">Home</span>
      </Link>
      <Link to="/import" className="flex items-center space-x-1 hover:underline">
        <FaFileImport className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-sm md:text-base">Import</span>
      </Link>
      <Link to="/family" className="flex items-center space-x-1 hover:underline">
        <FaUsers className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-sm md:text-base">Family</span>
      </Link>
    </div>
  );
}

export default Header;