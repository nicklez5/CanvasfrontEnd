import React from 'react'
import { FaLaptop, FaTabletAlt, FaMobileAlt, FaAtlas} from "react-icons/fa"
import useWindowSize from '../hooks/useWindowSize';
import { useParams, Link} from "react-router-dom"
import { PiX } from 'react-icons/pi';
const Header = ({title}) => {
  const myStyle = {
    paddingLeft: "10px",
    color: "white",
    textDecoration: "none"
  }
  const aStyle = {
    position: "absolute",
    top: "10px",
    left: "88%",
    color: "white",
    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
    marginTop: "15px",
    fontWeight: "300",
    fontSize: "32px"
  }
  const { width} = useWindowSize();
  return (
    <header className="Header">
        <h1><Link to="/">{title}</Link>{ width < 768 ? <Link to="/"><FaMobileAlt /></Link> : width < 992 ? <Link to="/"><FaTabletAlt  /></Link>: <Link to="/"><FaAtlas style={myStyle}/></Link>}</h1><a href="/Courses" style={aStyle}>Browse Courses</a>
    </header>

  )
}

export default Header