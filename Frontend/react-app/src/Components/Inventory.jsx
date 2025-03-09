import React, { useState, useEffect } from "react";
import "./Inventory.css";
import ItemFormat from "./ItemFormat";
import axios from "axios";

const categories = ["Electronics", "Furniture", "Clothing", "Tools"];
const subcategories = ["Expired"];

function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [groupedImages, setGroupedImages] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/inventory");
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

      const initialIndexes = {};
      Object.keys(grouped).forEach((uniqueIdentifier) => {
        initialIndexes[uniqueIdentifier] = 0;
      });
      setCurrentImageIndex(initialIndexes);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const toggleModal = () => {
    if (!isModalOpen) {
      // Opening the modal
      setIsEditMode(false);
      setEditingItem(null);
    }
    setIsModalOpen((prevState) => !prevState);
  };
  

  const handleEditItem = (group) => {
    setEditingItem({
      _id: group.images[0]._id,
      metadata: group.metadata,
      images: group.images.map((img) => img.filename),
    });
    setIsEditMode(true);
    setIsModalOpen(true);
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
      <div className="inventory-wrapper">
        {/* Sidebar */}
        <div className="sidebar">
        <div className="header-bar">
            <h1>Inventory</h1>
          </div>
          <h2>Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="inventory-main">

          <div className="search-bar">
            <input type="text" placeholder="Search inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} />
            <button className="add-btn" onClick={toggleModal}>+ Add Item</button>
          </div>

          <div className="image-grid">
            {Object.keys(groupedImages).length > 0 ? (
                Object.entries(groupedImages).map(([uniqueIdentifier, group]) => (
                    <div key={uniqueIdentifier} className="image-group">
                        {/* Image Section (Left) */}
                        {/* Image Carousel (Left) */}
                        {/* Image Carousel in Inventory List */}
<div className="image-carousel">
    <button className="carousel-btn prev-btn" onClick={() => handlePrevImage(uniqueIdentifier)}>❮</button>
    <div className="inventory-image-item">
        <img src={`http://localhost:5000/image/${group.images[currentImageIndex[uniqueIdentifier]].filename}`} alt="Item" />
    </div>
    <button className="carousel-btn next-btn" onClick={() => handleNextImage(uniqueIdentifier)}>❯</button>
</div>


                        {/* Details Section (Right) */}
                        <div className="metadata">
                            <h3>{group.metadata.itemName}</h3>
                            <p>Amount: {group.metadata.amount} {group.metadata.units}</p>
                            <p>Bought Date: {group.metadata.boughtDate || "N/A"}</p>
                            <p>Expiry Date: {group.metadata.expiriyDate || "N/A"}</p>

                            
                        </div>
                        <div>
                          {/* Edit Button */}
                          <button className="edit-btn" onClick={() => handleEditItem(group)}>Edit</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No items available.</p>
            )}
        </div>

        </div>
      </div>

      {/* Modal - This should appear on Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            {/* <div className="modal-header">
              <p>{isEditMode ? "Edit Item" : "Add Item"}</p>
              <button className="close-btn" onClick={toggleModal}>×</button>
            </div> */}
            <div className="modal-body">
              <ItemFormat
                isEditMode={isEditMode}
                editingItem={editingItem}
                onUpdateSuccess={fetchImages}
                closeModal={toggleModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
