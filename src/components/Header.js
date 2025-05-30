import React from 'react'
import { FaLaptop, FaTabletAlt, FaMobileAlt, FaAtlas} from "react-icons/fa"
import useWindowSize from '../hooks/useWindowSize';
import { useStoreState, useStoreActions} from "easy-peasy"
import { useParams, Link, useNavigate} from "react-router-dom"
import { PiX } from 'react-icons/pi';

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
    <header className="Header">
        <h1><Link to={{pathname: loggedIn ? "/home" : '/'}}>{title}</Link>{ width < 768 ? <Link to="/home"><FaMobileAlt /></Link> : width < 992 ? <Link to="/home"><FaTabletAlt  /></Link>: <Link to="/home"><FaAtlas style={myStyle}/></Link>}</h1><>{loggedIn ? (<><button className="logout" onClick={handleLogout}>Log out</button> </>) : <a href="/Courses" style={aStyle}>Browse Courses</a>}</>
    </header>

  )
}

export default Header