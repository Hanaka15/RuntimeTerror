import React from 'react';

// Navigation item component that handles both regular links and dropdowns
const NavItem = ({ item, isActive, onClick, isSurveyOpen, onSurveyToggle, onDropdownItemClick }) => {
    // Handle click events for both regular items and dropdown toggles
    const handleClick = (e) => {
        e.preventDefault();
        if (item.dropdown) {
            onSurveyToggle(e);
        } else {
            onClick(e);
        }
    };

    //Handle clicks on dropdown menu items
    const handleDropdownItemClick = (dropdownItem, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDropdownItemClick) {
            onDropdownItemClick(dropdownItem.key);
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
            {/* Render dropdown menu if item has dropdown and is open */}
            {item.dropdown && isSurveyOpen && item.dropdownItems && (
                <ul className="dashboard__nav-dropdown">
                    {item.dropdownItems.map((dropdownItem) => (
                        <li key={dropdownItem.key}>
                            <a 
                                href="/#" 
                                className="dashboard__nav-link" 
                                data-title={dropdownItem.title}
                                onClick={(e) => handleDropdownItemClick(dropdownItem, e)}
                            >
                                {dropdownItem.icon}
                                <span>{dropdownItem.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default NavItem;