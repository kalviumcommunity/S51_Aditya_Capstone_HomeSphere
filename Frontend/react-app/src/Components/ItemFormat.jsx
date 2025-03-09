import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import './ItemFormat.css';

function ItemFormat({ isEditMode, editingItem, onUpdateSuccess, closeModal }) {
    const { register, handleSubmit, setValue } = useForm();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [blocks, setBlocks] = useState([{ id: 1, units: "", location: "", specificity: "" }]);

    // Load existing item details in edit mode
    useEffect(() => {
        if (isEditMode && editingItem) {
            Object.entries(editingItem.metadata).forEach(([key, value]) => setValue(key, value));
            setExistingImages(editingItem.images || []);
        }
    }, [isEditMode, editingItem, setValue]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        const uniqueIdentifier = isEditMode ? editingItem.metadata.uniqueIdentifier : uuidv4();

        // Append metadata fields
        formData.append("uniqueIdentifier", uniqueIdentifier);
        formData.append("itemName", data.itemName);
        formData.append("amount", data.amount);
        formData.append("units", data.units);
        formData.append("boughtDate", data.boughtDate);
        formData.append("expiriyDate", data.expiriyDate);
        formData.append("guarantee", data.guarantee);
        formData.append("productLink", data.productLink);
        formData.append("blocks", JSON.stringify(blocks));

        // Append new images if selected
        selectedFiles.forEach((file) => formData.append("images", file));

        try {
            if (isEditMode) {
                // Update existing item
                await axios.put(`http://localhost:5000/update/${editingItem._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Item updated successfully!");
            } else {
                // Create new item
                await axios.post("http://localhost:5000/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Item added successfully!");
            }

            onUpdateSuccess();
            closeModal();
        } catch (error) {
            console.error("Error uploading/updating item:", error);
        }
    };

    // Handle new image selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    // Delete an existing image
    const handleDeleteImage = async (filename) => {
        try {
            await axios.delete(`http://localhost:5000/delete/${filename}`);
            setExistingImages(existingImages.filter((img) => img !== filename));
            alert("Image deleted successfully");
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    // Handle block changes
    const handleBlockChange = (id, field, value) => {
        setBlocks(blocks.map((block) => (block.id === id ? { ...block, [field]: value } : block)));
    };

    // Add a new block
    const addBlock = () => {
        setBlocks([...blocks, { id: blocks.length + 1, units: "", location: "", specificity: "" }]);
    };

    // Delete a block
    const deleteBlock = (id) => {
        setBlocks(blocks.filter((block) => block.id !== id));
    };

    return (
        <div className="form-container">
    {/* Modal Header */}
    <div className="modal-header">
        <p>{isEditMode ? "Edit Item" : "Upload Item"}</p>
        <button className="close-btn" onClick={closeModal}>×</button>
    </div>

    <form onSubmit={handleSubmit(onSubmit)}>

        {/* Top Section */}
        <div className="form-row">
            {/* Left - Name, Amount, Units */}
            <div className="top-left">
                <label>Item Name</label>
                <input type="text" {...register("itemName", { required: true })} />

                <label>Amount</label>
                <input type="number" {...register("amount", { required: true })} />

                <label>Units</label>
                <input type="number" {...register("units", { required: true })} />
            </div>

            {/* Right - Dates & Link */}
            <div className="top-right">
                <label>Bought Date</label>
                <input type="date" {...register("boughtDate")} />

                <label>Expiry Date</label>
                <input type="date" {...register("expiriyDate")} />

                <label>Guarantee</label>
                <input type="text" {...register("guarantee")} />

                {/* <label>Product Link</label>
                <input type="text" {...register("productLink")} /> */}
            </div>
        </div>

                {/* Upload New Images */}
                <div>
                <label>Upload New Images</label> <br></br>
                <input type="file" onChange={handleFileChange} multiple />
                </div>
               

{/* Image Section */}
<div className="modal-image-section">
    {/* Existing Images (Edit Mode) */}
    {isEditMode && existingImages.length > 0 && (
        existingImages.map((filename) => (
            <div key={filename} className="modal-image-item">
                <img src={`http://localhost:5000/image/${filename}`} alt="Item" />
                <button type="button" className="delete-btn" onClick={() => handleDeleteImage(filename)}>Delete</button>
            </div>
        ))
    )}

    {/* New Image Previews */}
    {selectedFiles.length > 0 && (
        selectedFiles.map((file, index) => (
            <div key={index} className="modal-image-item">
                <img src={URL.createObjectURL(file)} alt="Preview" />
            </div>
        ))
    )}
</div>





        {/* Blocks Section */}
        <div className="blocks-container">
            <p className="text-block">Blocks</p>
            {blocks.map((block) => (
                <div key={block.id} className="block-item">
                    <input type="number" placeholder="Units" value={block.units} onChange={(e) => handleBlockChange(block.id, "units", e.target.value)} />
                    <input type="text" placeholder="Location" value={block.location} onChange={(e) => handleBlockChange(block.id, "location", e.target.value)} />
                    <input type="text" placeholder="Specificity" value={block.specificity} onChange={(e) => handleBlockChange(block.id, "specificity", e.target.value)} />
                    
                    {/* Block Buttons */}
                    <div className="block-buttons">
                        <button type="button" onClick={() => deleteBlock(block.id)}>✖</button>
                        <button type="button" onClick={addBlock}>+</button>
                    </div>
                </div>
            ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
            {isEditMode ? "Update Item" : "Upload Item"}
        </button>

    </form>
</div>

    );
}

export default ItemFormat;

