// src/Components/Dashboard/Dashboard.jsx
import React from 'react';
import Navigation from './Navigation';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <>
        <div className="parent">
            <div className="div1"><div className="panel"></div></div>
            <nav><Navigation /></nav>
            <div className="div3"><div className="panel"></div></div>
        </div> 
        </>
    );
};

export default Dashboard;