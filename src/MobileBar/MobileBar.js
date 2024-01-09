import { Link } from 'react-router-dom';
import MobileSearch from './MobileSearch';

function MobileBar({ toggleOffcanvas }) {


    return (
        <div className="web-none d-flex align-items-center px-3 pt-3">
            <Link to="/feed" className="text-decoration-none">
                <img src="/logo.png" className="img-fluid logo-mobile" alt="brand-logo" />
            </Link>
            <MobileSearch />
            <button className="ms-auto btn btn-primary ln-0" type="button" onClick={toggleOffcanvas}>
                <span className="material-icons">menu</span>
            </button>
        </div>)
}

export default MobileBar