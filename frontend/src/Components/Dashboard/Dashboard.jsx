// src/Components/Dashboard/Dashboard.jsx
import React from 'react';
import Navigation from './Navigation/Navigation';
import TopBar from './topBar/topBar';
import SurveyGrid from './SurveyGrid/SurveyGrid';
import './Dashboard.scss';
import './topBar/topBar.css';

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