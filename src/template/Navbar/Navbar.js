import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "font-awesome/css/font-awesome.css";
import Button from 'react-bootstrap/Button'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';
import api from '../../api'
import Logo from './logoENI.png'
import Notification from './Notification'

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [logged, setLogged] = useState(false)
  const [eleveWithAbsence, setEleveWithAbsence] = useState([]);
  useEffect(() => {
    localStorage.getItem('role') ? setLogged(true) : setLogged(false)
  }, [localStorage.getItem('role')])

  const [notifications, setNotifications] = useState([]);

  const getNotifications = () => {
      api.get("/notification").then(function (response) {
          setNotifications(response.data)
      });
  }

  const markNotificationAsSeen = (id) =>{
    api.put("/notification/" + id, {
  }).then((response) => {
      if (response.status === 200) {
          getNotifications();
      }
      else {
          toast.error("Il y a sûrement une erreur")
      }
  })
  }

  useEffect(() => {
    getNotifications();
    console.log('notif', notifications)
  },[])

  const navigate = useNavigate()
  const showSidebar = () => setSidebar(!sidebar);
  const logout = () => {

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

          {/* {logged ? <div className='menu-bars'><FaIcons.FaBell/>  
            <ul className='autocomplete-list'>
              {
                notifications.map((notification, index) => (
                  <li key={index} className="autocomplete-list-item" onClick={() => markNotificationAsSeen(notification.id)}><div>{notification.texte}{' '}{' '}  <button className='btn btn-danger'><i className="fa fa-trash"></i> </button> </div></li>
                ))
              }
            </ul>


          <Button variant='danger' onClick={logout}>Se déconnecter</Button> </div> : ''} */}
          {logged ? <Button variant='danger' onClick={logout}>Se déconnecter</Button> : ''}
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