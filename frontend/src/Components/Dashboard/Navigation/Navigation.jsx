import React, { useState } from 'react';
import NavItem from './NavItem';
import { navItems } from './navData'; // import data for the navigation items (from navData.jsx)

const Navigation = () => {
    const [selectedItem, setSelectedItem] = useState('dashboard');
    const [selectedDropdownItem, setSelectedDropdownItem] = useState(null);
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    const handleItemClick = (key) => {
        setSelectedItem(key);
        setSelectedDropdownItem(null);
        if (key === 'surveys') {
            setIsSurveyOpen(!isSurveyOpen);
        } else {
            setIsSurveyOpen(false);
        }
    };

    const handleDropdownItemClick = (key) => {
        setSelectedDropdownItem(key);
    };

    // Find the selected item or dropdown item to display in the header
    const getSelectedItemForHeader = () => {
        if (selectedDropdownItem) {
            // Find the parent item (surveys) and the selected dropdown item
            const parentItem = navItems.find(item => item.dropdown);
            const dropdownItem = parentItem?.dropdownItems.find(item => item.key === selectedDropdownItem);
            
            if (dropdownItem) {
                return {
                    icon: dropdownItem.icon,
                    title: dropdownItem.title
                };
            }
        }
        
        //If no dropdown item is selected, return the selected item before clicking "surveys"
        const mainItem = navItems.find(item => item.key === selectedItem);
        return {
            icon: mainItem?.icon,
            title: mainItem?.title
        };
    };

    const selectedItemForHeader = getSelectedItemForHeader();

    return (
        <nav className="dashboard__nav">
            <div className="dashboard__nav-container">
                {/*Header showing selected item at top (with blue background)*/}
                <div className="dashboard__nav-header">
                    <div className="dashboard__nav-header-item">
                        {selectedItemForHeader.icon}
                        <span>{selectedItemForHeader.title}</span>
                    </div>
                </div>

                {/* line to separate selected item from the nav list */}
                <div className="dashboard__nav-separator"></div>

                {/*Navigation items (list of the items)*/}
                <ul className="dashboard__nav-list">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.key}
                            item={item}
                            isActive={item.key === selectedItem}
                            onClick={() => handleItemClick(item.key)}
                            isSurveyOpen={isSurveyOpen}
                            onSurveyToggle={() => setIsSurveyOpen(!isSurveyOpen)}
                            onDropdownItemClick={handleDropdownItemClick}
                            selectedDropdownItem={selectedDropdownItem}
                        />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
