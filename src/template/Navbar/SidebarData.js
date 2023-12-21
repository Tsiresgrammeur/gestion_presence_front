import React from 'react';
import * as FaIcons from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import { GiTeacher } from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Accueil',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Matière',
    path: '/matiere',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
 
  {
    title: 'Professeur',
    path: '/professeur',
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  {
    title: 'Elève',
    path: '/eleve',
    icon: <GiTeacher />,
    cName: 'nav-text'
  },

   {
    title: 'Présence',
    path: '/presence',
    icon: <SiGoogleclassroom/>,
    cName: 'nav-text'
  },
];