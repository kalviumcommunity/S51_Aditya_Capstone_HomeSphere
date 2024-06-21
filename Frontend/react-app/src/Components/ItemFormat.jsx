import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'; // Import Axios
import './ItemFormat.css'

function ItemFormat() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [data, setData] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]); // State to store the selected image URLs
    const [price, setPrice] = useState()
    const [units, setUnits] = useState()
    const [blocks, setBlocks] = useState([{ id: 1, units: '', location: '', specificity: '' }]);

    

    const postData = (data) => {
        const formData = new FormData();
        formData.append('itemName', data.itemName);
        formData.append('amount', data.amount);
        formData.append('units', data.units);
        formData.append('boughtDate', data.boughtDate);
        formData.append('expiriyDate', data.expiriyDate);
        formData.append('guarantee', data.guarantee);
        // formData.append('gifted', data.gifted ? 'true' : 'false');
        formData.append('productLink', data.productLink);
        formData.append('blocks', JSON.stringify(blocks));
    
        // Append the image file if present
        if (data.image && data.image[0]) {
            const imageUrl = URL.createObjectURL(data.image[0]);
            formData.append('image', imageUrl);
        }
    
        axios.post('http://localhost:3000/inventory', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log("error", err);
        });
    };

    const onSubmit = (data) => {
        setData(data);
        postData(data);
    };

    // Handler for file input change
    const handleImageChange = (e) => {
        const files = e.target.files;
        let previews = [];
        for (let i = 0; i < files.length; i++) {
            previews.push(URL.createObjectURL(files[i]));
        }
        setImagePreviews(previews);
    };

    const handleAmount = (e) => {
        setPrice(e.target.value)
    }
    const handleUnits = (e) => {
        setUnits(e.target.value)
    }
    const handleBlockChange = (id, field, value) => {
        setBlocks(blocks.map(block => block.id === id ? { ...block, [field]: value } : block));
    };    
    const addBlock = () => {
        setBlocks([...blocks, { id: blocks.length + 1 }]); // Add a new block with a unique id
    };
    const deleteBlock = (id) => {
        setBlocks(blocks.filter(block => block.id != id)); // Filter out the block with the specified id
    };
    console.log(blocks)

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}> {/* Use onSubmit */}

                <div className='form-container'>

                    <div className='primary-details'>

                        <div className='left-details'>
                            
                            <div className='left-top-details'>
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
                                        onInput={handleAmount}
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
                                        onInput={handleUnits}
                                        {...register("units", { required: true })}
                                    />
                                    {errors.units && <span>This field is required</span>}
                                </div>
                                <div>
                                    {price && units ? 
                                    <input value={price * units}></input> : price }
                                </div>
                            </div>

                            <div className='left-bottom-details'>
                                <input type='date' placeholder='enter date' {
                                    ...register("boughtDate", )
                                }></input>
                                <input type='date' placeholder='enter date' {
                                    ...register("expiriyDate", {
                                        required :true
                                    })
                                }></input>
                                <input type='text' placeholder='enter in years, months, days' {...register("guarantee", )}></input>
                            </div>
                        </div>


                        <div className='right-details'>
                            <div className='right-top-details'>
                                <div>
                                    <label htmlFor='image'>Upload Image</label>
                                    <input
                                        type='file'
                                        id='image'
                                        {...register("image")}
                                        onChange={handleImageChange} // Attach the handler to the input change event
                                    />
                                </div>
                                {imagePreviews.length > 0 && (
                                    <div>
                                        {imagePreviews.map((preview, index) => (
                                            <img key={index} src={preview} alt="Selected" style={{ width: '200px', height: 'auto' }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='right-bottom-details'>
                                {/* <label>
                                    <input type='checkbox' {...register("gifted")} />
                                    Gifted
                                </label> */}
                                <input type='text' placeholder='Product link' {...register("productLink")} />
                            </div>
                        </div>
                    </div>

                    <div className='secondary-details'>
                    <button type="button" onClick={addBlock}>Add</button>
                        {blocks.map((block) => (
                            <div key={block.id} className="block">
                                <input 
                                    type="number" 
                                    placeholder="Enter units" 
                                    value={block.units}
                                    onChange={(e) => handleBlockChange(block.id, 'units', e.target.value)}
                                />
                                <input 
                                    type='text' 
                                    placeholder='Enter the location'
                                    value={block.location}
                                    onChange={(e) => handleBlockChange(block.id, 'location', e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Enter specificity about it/them" 
                                    value={block.specificity}
                                    onChange={(e) => handleBlockChange(block.id, 'specificity', e.target.value)}
                                />
                                <button type="button" onClick={() => deleteBlock(block.id)}>Delete</button>
                            </div>
                        ))}

                    </div>
                    {/* <div>
                        {blocks && blocks.forEach(block => {
                            <div>
                                <p>{block.units}</p>
                                <p>{block.location}</p>
                            </div>
                            
                        })}
                    </div> */}
                    {/* <div>
                        {blocks[0].units}
                    </div> */}

                </div>
                <button type='submit'>Submit</button> {/* Add submit button */}

                
            </form>
            
        </div>
    );
}

export default ItemFormat;
