import React from 'react';
import './topBar.scss';
//Import image directly FOR NOW (CHANGE LATER)
import profileImage from '../images/Juden.jpg';

const TopBar = () => {
    const userName = "Big Boss Håkon"; //place holder for the logged in user

    return (
        <div className="dashboard__header">
            <div className="dashboard__header-left"> {/* Left side content if needed later*/}
            </div>
            <div className="dashboard__header-right">
                <div className="dashboard__user-info">
                    <span className="user-name">{userName}</span>
                    <div className="dashboard__profile">
                        <img 
                            src={profileImage} alt="Profile Picture" className="dashboard__profile-pic"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;