import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css'

import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/Login'
import Register from "./Components/Register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div><Dashboard/></div>,
  },

  {
    path: "/register",
    element: <div><Register/></div>,
  },

  {
    path: "/login",
    element: <div><Login/></div>,
  },
]);

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
