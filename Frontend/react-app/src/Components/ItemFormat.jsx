import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Use this package to generate unique IDs

function ItemFormat() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedFiles, setSelectedFiles] = useState([]); // Initialize as an array
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [blocks, setBlocks] = useState([{ id: 1, units: '', location: '', specificity: '' }]);
    
    const onSubmit = async (data) => {
        const formData = new FormData();
        const uniqueIdentifier = uuidv4(); // Generate a unique identifier
    
        // Append multiple images
        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });
        }
    
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
    
        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                setUploadSuccess(true);
                console.log("Files uploaded successfully:", response.data);
            } else {
                console.error("Failed to upload files");
            }
        } catch (error) {
            console.error("Error during upload:", error);
        }
    };
    
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array
        setSelectedFiles([...selectedFiles, ...files]); // Update selectedFiles array
    };

    const handleBlockChange = (id, field, value) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, [field]: value } : block
        ));
    };

    const addBlock = () => {
        setBlocks([...blocks, { id: blocks.length + 1, units: '', location: '', specificity: '' }]);
    };

    const deleteBlock = (id) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    return (
        <div>
            <h2>Upload Item</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='itemName'>Enter your item name</label>
                    <input
                        type='text'
                        placeholder='Enter item name'
                        id='itemName'
                        {...register("itemName", { required: true })}
                    />
                    {errors.itemName && <span>This field is required</span>}
                </div>

                <div>
                    <label htmlFor='amount'>Enter amount</label>
                    <input
                        type='number'
                        placeholder='Enter amount'
                        id='amount'
                        {...register("amount", { required: true })}
                    />
                    {errors.amount && <span>This field is required</span>}
                </div>

                <div>
                    <label htmlFor='units'>Enter units</label>
                    <input
                        type='number'
                        placeholder='Enter units'
                        id='units'
                        {...register("units", { required: true })}
                    />
                    {errors.units && <span>This field is required</span>}
                </div>

                <div>
                    <label htmlFor='boughtDate'>Bought Date</label>
                    <input type='date' {...register("boughtDate")} />
                </div>

                <div>
                    <label htmlFor='expiriyDate'>Expiry Date</label>
                    <input type='date' {...register("expiriyDate", { required: false })} />
                    {errors.expiriyDate && <span>This field is required</span>}
                </div>

                <div>
                    <label htmlFor='guarantee'>Guarantee (years, months, days)</label>
                    <input type='text' placeholder='Enter guarantee period' {...register("guarantee")} />
                </div>

                <div>
                    <label htmlFor='productLink'>Product Link</label>
                    <input type='text' placeholder='Product link' {...register("productLink")} />
                </div>

                <div>
                    <label htmlFor='images'>Upload Images</label>
                    <input
                        type='file'
                        id='images'
                        {...register('images')}
                        onChange={handleFileChange}
                        multiple // Allow multiple files
                    />
                </div>

                {/* Image Preview */}
                <div className="image-preview">
                    {selectedFiles.length > 0 && selectedFiles.map((file, index) => (
                        <img 
                            key={index} 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index}`} 
                            style={{ width: '100px', margin: '10px' }}
                        />
                    ))}
                </div>

                <div className='blocks-section'>
                    <h3>Blocks</h3>
                    <button type="button" onClick={addBlock}>Add Block</button>
                    {blocks.map((block) => (
                        <div key={block.id} className="block-item">
                            <label>Units</label>
                            <input 
                                type="number" 
                                placeholder="Enter units" 
                                value={block.units}
                                onChange={(e) => handleBlockChange(block.id, 'units', e.target.value)}
                            />
                            
                            <label>Location</label>
                            <input 
                                type="text" 
                                placeholder="Enter the location"
                                value={block.location}
                                onChange={(e) => handleBlockChange(block.id, 'location', e.target.value)}
                            />

                            <label>Specificity</label>
                            <input 
                                type="text" 
                                placeholder="Enter specificity"
                                value={block.specificity}
                                onChange={(e) => handleBlockChange(block.id, 'specificity', e.target.value)}
                            />

                            <button type="button" onClick={() => deleteBlock(block.id)}>Delete Block</button>
                        </div>
                    ))}
                </div>

                <button type='submit'>Upload</button>
            </form>

            {uploadSuccess && <p>File uploaded successfully!</p>}
        </div>
    );
}

export default ItemFormat;
