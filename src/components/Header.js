import React from 'react'
import { FaLaptop, FaTabletAlt, FaMobileAlt, FaAtlas} from "react-icons/fa"
import useWindowSize from '../hooks/useWindowSize';
import { useStoreState, useStoreActions} from "easy-peasy"
import { useParams, Link, useNavigate} from "react-router-dom"
import { PiX } from 'react-icons/pi';
import { Navbar, Container, Nav ,Button } from 'react-bootstrap';
const Header = ({title}) => {
  const navigate = useNavigate()
  const loggedIn = useStoreState((state) => state.userStore.loggedIn)
  const logout = useStoreActions((actions) => actions.userStore.logout)
  const myStyle = {
    paddingLeft: "10px",
    color: "white",
    textDecoration: "none"
  }
  const aStyle = {
    position: "absolute",
    top: "10px",
    left: "250vh",
    color: "white",
    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
    marginTop: "15px",
    fontWeight: "300",
    fontSize: "32px"
  }
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const { width} = useWindowSize();
  return (
     <nav className="navbar navbar-expand-lg navbar-dark fixed-top shadow" style={{backgroundColor: "rgb(11,15,25"}}>
      <div className="container-fluid">
        <Link className="navbar-brand" to={loggedIn ? '/home' : '/'}>{title}</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {loggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">Browse Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/UserCourses">Enrolled Courses</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {loggedIn ? (
              <li className="nav-item">
                <button className="btn btn-outline-light  btn-logout" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-spacious" to="/courses">
                  Browse Courses
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>

  )
}

export default Header