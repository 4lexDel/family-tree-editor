import { Link } from 'react-router-dom';
import './header.css'

const Header = () => {

    return (
        <div className="header">
            <Link to={'/home'}>Home</Link>
            <span> / </span>
            <Link to={'/import'}>Import</Link>
            <span> / </span>
            <Link to={'/family'}>Family</Link>
        </div>
    )
}

export default Header;