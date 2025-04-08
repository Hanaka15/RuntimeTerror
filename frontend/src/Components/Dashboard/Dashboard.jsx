// src/Components/Dashboard/Dashboard.jsx
import React from 'react';
import Navigation from './Navigation/Navigation';
import TopBar from './topBar/topBar';
import SurveyGrid from './SurveyGrid/SurveyGrid';
import './Dashboard.css';
import './topBar/topBar.scss';

const Dashboard = () => {
    return (
        <>
        <div className="parent">
            <main className="div1">
                <div className="panel">
                    <SurveyGrid />
                </div>
            </main>
            <nav><Navigation /></nav>
            <div className="Topbar">
                <div className="panel">
                    <header><TopBar /></header>
                </div>
            </div>
        </div> 
        </>
    );
};

export default Dashboard;