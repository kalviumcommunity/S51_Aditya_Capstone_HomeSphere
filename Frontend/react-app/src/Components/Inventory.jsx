import React, { useState, useEffect, useRef } from 'react';
import NavBar from './Navbar';
import './Inventory.css';
import ItemFormat from './ItemFormat';
import { Link } from 'react-router-dom';

const initialState = [
  { category: 'Electronics', data: 'Laptop', amount: 10, second: 'pcs' },
//   { category: 'Furniture', data: 'Chair', amount: 20, units: 'units' },
];

const categories = ['Electronics', 'Furniture', 'Clothing', 'Tools' ]; // Define sidebar categories
const subcategories = ['Expired', 'Some Other Thing']; // Define sidebar subcategories

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState(initialState);
  const [searchTerm, setSearchTerm] = useState('');
  const sidebarRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Fetch data from an API or local storage (if not using initial state)
  useEffect(() => {
    // Implement data fetching logic here
    // e.g., fetch('https://your-api.com/inventory')
    //   .then(response => response.json())
    //   .then(data => setInventoryItems(data));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleAddItem = () => {
    // Implement logic to open a modal or form for adding new items
    console.log('Add item button clicked');
  };

  const filteredItems = inventoryItems.filter((item) =>
    item.category.toLowerCase().includes(searchTerm) ||
    item.data.toLowerCase().includes(searchTerm)
  );

  const handleSidebarScroll = (event) => {
    if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
      // Scrolling within sidebar
      event.stopPropagation(); // Prevent event from bubbling up to the document
    } else {
      // Scrolling outside sidebar (reset scroll position)
      sidebarRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', handleSidebarScroll);

    return () => document.removeEventListener('scroll', handleSidebarScroll);
  }, []);

    // Function to toggle the modal state
    const toggleModal = () => {
        setIsModalOpen(prevState => !prevState);
    };

  return (
    <div className="inventory-container">
      {/* <NavBar /> */}
      <div className="inventory-wrapper" ref={sidebarRef}>
        <div className="sidebar">
          <h2>Inventory Categories</h2>
          <div className="sidebar-scrollable">
            <ul>
              {categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </div>
          <div className="sidebar-fixed">
            <ul>
              {subcategories.map((subcategory) => (
                <li key={subcategory}>{subcategory}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="inventory-main">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {/* <Link to='/item'><button onClick={handleAddItem}>Add Item</button></Link> */}
          <div>
            <h1>Inventory</h1>
            <button onClick={toggleModal}>Add Item</button>

            {/* Render ItemFormat component as a modal */}
            {isModalOpen && (
                <div className='modal-container'>
                <div className='modal-header'>
                  <div className='modal-title'>Add new Item</div>
                  <div className='close-button-container'>
                    <button onClick={toggleModal}>X</button>
                  </div>
                </div>
                <div className='modal-body'>
                  <ItemFormat/>
                </div>
                </div>
            )}
        </div>
          <div className="inventory-tiles">
            {filteredItems.map((item) => (
              <div className="inventory-tile" key={item.data}>
                <div className="tile-category">{item.category}</div>
                <div className="tile-data">{item.data}</div>
                <div className="tile-amount">
                  {item.amount} {item.second}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
