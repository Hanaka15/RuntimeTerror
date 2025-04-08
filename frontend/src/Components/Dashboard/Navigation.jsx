import React, { useState } from 'react';
import NavItem from './NavItem';
import { navItems } from './navData'; // We'll create this next

const Navigation = () => {
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('dashboard');

    const toggleSurveyDropdown = (e) => {
        e.preventDefault();
        setIsSurveyOpen(!isSurveyOpen);
    };

    const handleItemClick = (key, e) => {
        e.preventDefault();
        setSelectedItem(key);
    };

    return (
        <nav className="dashboard__nav">
            <div className="dashboard__nav-container">
                {/* Selected item at top */}
                <div className="dashboard__nav-header">
                    <NavItem 
                        item={navItems[selectedItem]}
                        isActive={true}
                        onClick={(e) => handleItemClick(selectedItem, e)}
                        isSurveyOpen={isSurveyOpen}
                        onSurveyToggle={toggleSurveyDropdown}
                    />
                </div>

                {/* Separator */}
                <div className="dashboard__nav-separator"></div>

                {/* Full list of navigation items */}
                <ul className="dashboard__nav-list">
                    {Object.entries(navItems).map(([key, item]) => (
                        <NavItem 
                            key={key}
                            item={item}
                            isActive={key === selectedItem}
                            onClick={(e) => handleItemClick(key, e)}
                            isSurveyOpen={isSurveyOpen}
                            onSurveyToggle={toggleSurveyDropdown}
                        />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
