import React, { useState,useEffect } from 'react';

import Button from 'react-bootstrap/Button'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';
import Logo from './logoENI.png'

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [logged, setLogged] = useState(false)
  useEffect(() =>{
    localStorage.getItem('role') ? setLogged(true): setLogged(false)
  },[localStorage.getItem('role')])

  const navigate = useNavigate()
  const showSidebar = () => setSidebar(!sidebar);
  const logout = () =>{
    
    localStorage.removeItem('role');
    navigate('/login')
  }

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>

          <div style={{ alignItems: "center", display: 'flex' }}>
            <Link to='/accueil'>
              <img src={Logo} alt='Logo ENI' width={50} />
            </Link>

            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
         {logged ? <Button variant='danger' onClick={logout}>Se déconnecter</Button>:''}
        </div>

        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>


      </IconContext.Provider>
    </>
  );
}

export default Navbar;