import React from 'react';

const NavItem = ({ item, isActive, onClick, isSurveyOpen, onSurveyToggle }) => {
    const handleClick = (e) => {
        e.preventDefault();
        if (item.dropdown) {
            onSurveyToggle(e);
        } else {
            onClick(e);
        }
    };

    return (
        <li className={`dashboard__nav-item ${item.dropdown && isSurveyOpen ? 'open' : ''}`}>
            <a 
                href="/#" 
                className={`dashboard__nav-link ${isActive ? 'dashboard__nav-link--active' : ''}`}
                data-title={item.title}
                onClick={handleClick}
            >
                {item.icon}
                <span>{item.title}</span>
                {item.dropdown && (
                    <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                    </svg>
                )}
            </a>
            {item.dropdown && isSurveyOpen && (
                <ul className="dashboard__nav-dropdown">
                    <li>
                        <a href="/#" className="dashboard__nav-link" data-title="New survey">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <title>invoice-text-plus</title>
                                <path d="M3 3V22L6 20L9 22L12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 15.69 15.69 13 19 13C19.7 13 20.37 13.12 21 13.34V3H3M17 7V9H7V7H17M15 11V13H7V11H15M18 15V18H15V20H18V23H20V20H23V18H20V15H18Z" />
                            </svg>
                            <span>New survey</span>
                        </a>
                    </li>
                </ul>
            )}
        </li>
    );
};

export default NavItem;
