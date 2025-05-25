import React from 'react';

import {
    createBrowserRouter,
  } from "react-router";
import Roots from '../Roots/Roots';
import Home from '../Component/Home';
 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Roots></Roots>,
      children:[
        {
          index:true,
          element:<Home></Home>
        }
      ]
    },
  ]);