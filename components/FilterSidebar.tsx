import React, { useState } from 'react';

const FilterSidebar = ({ items }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilters(prevFilters => {
            if (prevFilters.includes(filter)) {
                return prevFilters.filter(f => f !== filter);
            } else {
                return [...prevFilters, filter];
            }
        });
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (selectedFilters.length === 0 || selectedFilters.includes(item.category))
    );

    return (
        <div className="filter-sidebar">
            <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
            />
            <div className="filters">
                <h3>Filters</h3>
                {/* Example filter categories */}
                <div>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={selectedFilters.includes('Category1')} 
                            onChange={() => handleFilterChange('Category1')} 
                        />
                        Category 1
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={selectedFilters.includes('Category2')} 
                            onChange={() => handleFilterChange('Category2')} 
                        />
                        Category 2
                    </label>
                </div>
            </div>
            <ul>
                {filteredItems.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default FilterSidebar;