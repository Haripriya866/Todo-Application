import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";

const Header = () => (
  <nav className="header-container fixed-top">
    <ul className="nav-items-container">
      <Link className="nav-link" to="/register">
        <li className="list-item">
          <span className="name">Signup</span>
        </li>
      </Link>
      <Link className="nav-link" to="/login/">
        <li className="list-item">
          <span className="name">Login</span>
        </li>
      </Link>
    </ul>
  </nav>
);
export default Header;
