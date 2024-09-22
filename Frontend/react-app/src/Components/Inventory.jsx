import React, { useState, useEffect, useRef } from 'react';
import NavBar from './Navbar';
import './Inventory.css';
import ItemFormat from './ItemFormat';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
  const [files, setFiles] = useState()
  const [images, setImages] = useState([]);




  // Fetch data from an API or local storage (if not using initial state)
  // useEffect(() => {
  //   // Implement data fetching logic here
  //   // e.g., fetch('https://your-api.com/inventory')
  //   //   .then(response => response.json())
  //   //   .then(data => setInventoryItems(data));
  //   getData()
  // }, []);

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

  useEffect(() => {
    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/inventory');
            setImages(response.data);
            console.log('Fetched Images:', response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    fetchImages();
}, []);

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

    const getImageUrl = (filename) => {
      // Remove the file extension (e.g., ".png")
      const baseName = filename.split('.').slice(0, -1).join('.');
      return `http://localhost:3000/images/${baseName}`;
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
        <div className="image-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {images.length > 0 ? (
              images.map((image) => (
                  <div key={image._id} className="image-item" style={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      boxSizing: 'border-box'
                  }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <img
                              src={`http://localhost:5000/image/${image.filename}`}
                              alt={image.filename}
                              style={{ width: '80px', height: 'auto', borderRadius: '8px', marginRight: '10px' }}
                          />
                          <p>{image.filename}</p>
                      </div>
                      {image.metadata && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              <div style={{ flex: '1 1 200px' }}>Item Name: {image.metadata.itemName}</div>
                              <div style={{ flex: '1 1 100px' }}>Amount: {image.metadata.amount}</div>
                              <div style={{ flex: '1 1 100px' }}>Units: {image.metadata.units}</div>
                              <div style={{ flex: '1 1 150px' }}>Bought Date: {image.metadata.boughtDate}</div>
                              <div style={{ flex: '1 1 150px' }}>Expiry Date: {image.metadata.expiriyDate}</div>
                              <div style={{ flex: '1 1 150px' }}>Guarantee: {image.metadata.guarantee}</div>
                              <div style={{ flex: '1 1 100%' }}>
                                  Product Link: <a href={image.metadata.productLink} target="_blank" rel="noopener noreferrer">View Product</a>
                              </div>

                              {/* Handle blocks rendering */}
                              <div style={{ flex: '1 1 100%', marginTop: '10px' }}>
                                  <p>Blocks:</p>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                      {(typeof image.metadata.blocks === "string"
                                          ? JSON.parse(image.metadata.blocks) // If blocks is a string, parse it
                                          : image.metadata.blocks // If blocks is an object, use it directly
                                      ).map((block) => (
                                          <div key={block.id} style={{
                                              border: '1px solid #ddd',
                                              borderRadius: '5px',
                                              padding: '5px',
                                              flex: '1 1 150px', // Adjust the size of block items
                                              margin: '5px'
                                          }}>
                                              <p>Block ID: {block.id}</p>
                                              <p>Units: {block.units}</p>
                                              <p>Location: {block.location}</p>
                                              <p>Specificity: {block.specificity}</p>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              ))
          ) : (
              <p>No images uploaded yet</p>
          )}
        </div>

        </div>
      </div>
    </div>
  );
}

export default Inventory;
