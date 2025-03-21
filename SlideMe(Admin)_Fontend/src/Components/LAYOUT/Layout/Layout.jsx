import "./Layout.css";

import { Outlet } from "react-router-dom";

import Header from "../Header/Header";
import Navber from "../Navber/Navber";
import Footer from "../Footer/Footer";

function Layout({tab, setTab, setToken}) {
    return ( 
        <div className="layout">
            <Header/>
            <Navber tab = {tab} setTab = {setTab} setToken= {setToken}/>
            <Outlet />
            <Footer/>
        </div>
     );
}

export default Layout;