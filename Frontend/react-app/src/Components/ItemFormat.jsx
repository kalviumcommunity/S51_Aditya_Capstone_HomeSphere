import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function ItemFormat() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    // const [images, setImages] = useState([]);
    const [blocks, setBlocks] = useState([{ id: 1, units: '', location: '', specificity: '' }]);

    // Fetch the list of images from the server
    // useEffect(() => {
    //     const fetchImages = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/inventory');
    //             setImages(response.data);
    //             console.log('Fetched Images:', response.data);
    //         } catch (error) {
    //             console.error('Error fetching images:', error);
    //         }
    //     };

    //     fetchImages();
    // }, []);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('images', selectedFile);
        formData.append('itemName', data.itemName);
        formData.append('amount', data.amount);
        formData.append('units', data.units);
        formData.append('boughtDate', data.boughtDate);
        formData.append('expiriyDate', data.expiriyDate);
        formData.append('guarantee', data.guarantee);
        formData.append('productLink', data.productLink);
        formData.append('blocks', JSON.stringify(blocks));

        // selectedFile.forEach((image) => {
        //     formData.append('images', image);
        // });

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setUploadSuccess(true);
                console.log('File uploaded successfully:', response.data);
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleBlockChange = (id, field, value) => {
        setBlocks(blocks.map(block => block.id === id ? { ...block, [field]: value } : block));
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
                        placeholder='enter item name'
                        id='itemName'
                        {...register("itemName", { required: true })}
                    />
                    {errors.itemName && <span>This field is required</span>}
                </div>

                <div>
                    <label htmlFor='amount'>Enter amount</label>
                    <input
                        type='number'
                        placeholder='enter amount'
                        id='amount'
                        {...register("amount", { required: true })}
                    />
                    {errors.amount && <span>This field is required</span>}
                </div>

                <div>
                    <label htmlFor='units'>Enter units</label>
                    <input
                        type='number'
                        placeholder='enter units'
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
                    <input type='date' {...register("expiriyDate", { required: true })} />
                    {errors.expiriyDate && <span>This field is required</span>}
                </div>

                <div>
                    <label htmlFor='guarantee'>Guarantee (years, months, days)</label>
                    <input type='text' placeholder='enter guarantee period' {...register("guarantee")} />
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
                    />
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

            {/* <h2>Uploaded Images</h2>
            <div className="image-grid">
                {images.length > 0 ? (
                    images.map((image) => (
                        <div key={image._id} className="image-item">
                            <img
                                src={`http://localhost:5000/image/${image.filename}`}
                                alt={image.filename}
                                style={{ width: '200px', height: 'auto' }}
                            />
                            <p>{image.filename}</p>
                            {image.metadata && (
                                <>
                                <p>Item Name: {image.metadata.itemName}</p>
                                <p>Amount: {image.metadata.amount}</p>
                                <p>Units: {image.metadata.units}</p>
                                <p>Bought Date: {image.metadata.boughtDate}</p>
                                <p>Expiry Date: {image.metadata.expiriyDate}</p>
                                <p>Guarantee: {image.metadata.guarantee}</p>
                                <p>Product Link: <a href={image.metadata.productLink} target="_blank" rel="noopener noreferrer">View Product</a></p>
                            
                                {/* Handle blocks rendering */}
                                {/* <p>Blocks:</p>
                                <ul>
                                    {(typeof image.metadata.blocks === "string"
                                        ? JSON.parse(image.metadata.blocks) // If blocks is a string, parse it
                                        : image.metadata.blocks // If blocks is an object, use it directly
                                    ).map((block) => (
                                        <li key={block.id}>
                                            <p>Block ID: {block.id}</p>
                                            <p>Units: {block.units}</p>
                                            <p>Location: {block.location}</p>
                                            <p>Specificity: {block.specificity}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                            
                            
                            )}
                        </div>
                    ))
                ) : (
                    <p>No images uploaded yet</p>
                )}
            </div> */} 
        </div>
    );
}

export default ItemFormat;
