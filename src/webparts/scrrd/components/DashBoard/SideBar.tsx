import * as React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../components/Page/Sidebar.scss';
import { IScrrdProps } from '../IScrrdProps';
import logo from "../../assets/SonaPNGLogo.png";

const Sidebar = (props: IScrrdProps) => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="sidehead">
                <div className="logo">
                    <img src={logo} width="25px" height="25px" />
                </div>
                <div className="sidehead-right">SONA COMSTAR</div>
            </div>

            <ul className="nav">
                <li className="nav-item">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    >
                        Department Dashboard
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/hod-approval"
                        className={`nav-link ${location.pathname === "/hod-approval" ? "active" : ""}`}
                    >
                        HOD Approval
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/isct-approval"
                        className={`nav-link ${location.pathname === "/isct-approval" ? "active" : ""}`}
                    >
                        ISCT Approval
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;