import React, { useState, useEffect, useRef } from 'react';
import './Inventory.css';
import ItemFormat from './ItemFormat';
import axios from 'axios';

const initialState = [
  { category: 'Electronics', data: 'Laptop', amount: 10, second: 'pcs' },
];

const categories = ['Electronics', 'Furniture', 'Clothing', 'Tools']; // Define sidebar categories
const subcategories = ['Expired']; // Define sidebar subcategories

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState(initialState);
  const [searchTerm, setSearchTerm] = useState('');
  const sidebarRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [groupedImages, setGroupedImages] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // To track the current image index for each group

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

        // After fetching images, group them by uniqueIdentifier
        const grouped = response.data.reduce((acc, image) => {
          const uniqueIdentifier = image.metadata.uniqueIdentifier;
          if (!acc[uniqueIdentifier]) {
            acc[uniqueIdentifier] = {
              metadata: image.metadata,
              images: [],
            };
          }
          acc[uniqueIdentifier].images.push(image);
          return acc;
        }, {});

        setGroupedImages(grouped);

        // Initialize currentImageIndex for each group
        const initialIndexes = {};
        Object.keys(grouped).forEach((uniqueIdentifier) => {
          initialIndexes[uniqueIdentifier] = 0;
        });
        setCurrentImageIndex(initialIndexes);
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
    setIsModalOpen((prevState) => !prevState);
  };

  const handleNextImage = (uniqueIdentifier) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [uniqueIdentifier]:
        (prevState[uniqueIdentifier] + 1) % groupedImages[uniqueIdentifier].images.length,
    }));
  };

  const handlePrevImage = (uniqueIdentifier) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [uniqueIdentifier]:
        (prevState[uniqueIdentifier] - 1 + groupedImages[uniqueIdentifier].images.length) %
        groupedImages[uniqueIdentifier].images.length,
    }));
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
          <div>
            <h1>Inventory</h1>
            <button onClick={toggleModal}>Add Item</button>

            {/* Render ItemFormat component as a modal */}
            {isModalOpen && (
              <div className="modal-container">
                <div className="modal-header">
                  <div className="modal-title">Add new Item</div>
                  <div className="close-button-container">
                    <button onClick={toggleModal}>X</button>
                  </div>
                </div>
                <div className="modal-body">
                  <ItemFormat />
                </div>
              </div>
            )}
          </div>

          <div
            className="image-grid"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {Object.keys(groupedImages).length > 0 ? (
              Object.entries(groupedImages).map(([uniqueIdentifier, group]) => (
                <div
                  key={uniqueIdentifier}
                  className="image-group"
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div className="metadata" style={{ marginBottom: '10px' }}>
                    <h3>Item Name: {group.metadata.itemName}</h3>
                    <p>Amount: {group.metadata.amount}</p>
                    <p>Units: {group.metadata.units}</p>
                    <p>Bought Date: {group.metadata.boughtDate}</p>
                    <p>Expiry Date: {group.metadata.expiriyDate}</p>
                    <p>Guarantee: {group.metadata.guarantee}</p>
                    <p>
                      Product Link:{' '}
                      <a
                        href={group.metadata.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Product
                      </a>
                    </p>
                    {/* Handle blocks rendering */}
                    <p>Blocks:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {(typeof group.metadata.blocks === 'string'
                        ? JSON.parse(group.metadata.blocks) // If blocks is a string, parse it
                        : group.metadata.blocks // If blocks is an object, use it directly
                      ).map((block) => (
                        <div
                          key={block.id}
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            padding: '5px',
                            flex: '1 1 150px', // Adjust the size of block items
                            margin: '5px',
                          }}
                        >
                          <p>Block ID: {block.id}</p>
                          <p>Units: {block.units}</p>
                          <p>Location: {block.location}</p>
                          <p>Specificity: {block.specificity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image carousel */}
                  <div
                    className="image-carousel"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <button onClick={() => handlePrevImage(uniqueIdentifier)}>Prev</button>
                    <div className="image-item" style={{ margin: '0 10px' }}>
                      <img
                        src={`http://localhost:5000/image/${
                          group.images[currentImageIndex[uniqueIdentifier]].filename
                        }`}
                        alt={group.images[currentImageIndex[uniqueIdentifier]].filename}
                        style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
                      />
                      <p>{group.images[currentImageIndex[uniqueIdentifier]].filename}</p>
                    </div>
                    <button onClick={() => handleNextImage(uniqueIdentifier)}>Next</button>
                  </div>

                  {/* Thumbnails */}
                  <div
                    className="thumbnails"
                    style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
                  >
                    {group.images.map((image, index) => (
                      <img
                        key={image._id}
                        src={`http://localhost:5000/image/${image.filename}`}
                        alt={image.filename}
                        style={{
                          width: '80px',
                          height: 'auto',
                          borderRadius: '5px',
                          border:
                            currentImageIndex[uniqueIdentifier] === index
                              ? '2px solid blue'
                              : '1px solid #ddd',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          setCurrentImageIndex((prevState) => ({
                            ...prevState,
                            [uniqueIdentifier]: index,
                          }))
                        }
                      />
                    ))}
                  </div>
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
