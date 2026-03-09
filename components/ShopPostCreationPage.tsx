import React, { useState, useRef } from 'react';
import { AddImagePlaceholderIcon, LocationPinIcon } from '../constants';
import type { ShopPost } from '../types';

interface ShopPostCreationPageProps {
  onPublish: (postData: Omit<ShopPost, 'id' | 'seller' | 'rating' | 'reviews' | 'views'>) => void;
}

const InputField: React.FC<{ label: string, placeholder: string, value: string, onChange: (val: string) => void, type?: string, required?: boolean, icon?: React.ReactNode }> = ({ label, placeholder, value, onChange, type = "text", required = false, icon }) => (
    <div>
        <label className="text-sm font-semibold text-gray-400 mb-1 block">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className={`w-full bg-[#1A1B20] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
);

const TextareaField: React.FC<{ label: string, placeholder: string, value: string, onChange: (val: string) => void }> = ({ label, placeholder, value, onChange }) => (
    <div>
        <label className="text-sm font-semibold text-gray-400 mb-1 block">{label}</label>
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full bg-[#1A1B20] border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
    </div>
);

const SelectField: React.FC<{ label: string, value: string, onChange: (val: string) => void, children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div>
        <label className="text-sm font-semibold text-gray-400 mb-1 block">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#1A1B20] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none bg-no-repeat bg-right pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
        >
            {children}
        </select>
    </div>
);

const RadioGroup: React.FC<{ label: string, name: string, options: string[], selected: string, onChange: (val: string) => void }> = ({ label, name, options, selected, onChange }) => (
    <div>
        <label className="text-sm font-semibold text-gray-400 mb-2 block">{label}</label>
        <div className="flex gap-4">
            {options.map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={selected === option}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 accent-cyan-500"
                    />
                    <span className="text-sm font-medium text-gray-200">{option}</span>
                </label>
            ))}
        </div>
    </div>
);


const ShopPostCreationPage: React.FC<ShopPostCreationPageProps> = ({ onPublish }) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [condition, setCondition] = useState<'New' | 'Used'>('New');
    const [location, setLocation] = useState('');
    const [deliveryOption, setDeliveryOption] = useState('Courier');
    const [deliveryCharge, setDeliveryCharge] = useState<'Included' | 'Separate'>('Included');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            // FIX: Cast `file` to `Blob` to satisfy `URL.createObjectURL`'s type requirement,
            // as TypeScript was inferring its type as `unknown`.
            const newImageUrls = files.map(file => URL.createObjectURL(file as Blob));
            setImageUrls(prev => [...prev, ...newImageUrls].slice(0, 4));
        }
    };
    
    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };
    
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    
    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName || !price || imageUrls.length === 0) {
            alert('Please fill in all required fields and upload at least one image.');
            return;
        }

        onPublish({
            imageUrls,
            title: productName,
            price,
            description,
            category,
            size,
            color,
            condition,
            location,
            deliveryOption,
            deliveryCharge,
        });
    };

    return (
        <form onSubmit={handlePublish} className="w-full max-w-2xl mx-auto p-4 space-y-6">
            <div className="bg-[#1A1B20] p-6 rounded-lg border border-gray-800">
                <h2 className="text-lg font-bold mb-4 text-white">1. Product Images</h2>
                <div className="grid grid-cols-4 gap-4">
                   {imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square">
                            <img src={url} alt={`product preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                            <button 
                                type="button" 
                                onClick={() => removeImage(index)} 
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-lg leading-none border-2 border-[#1A1B20]"
                                aria-label="Remove image"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    {imageUrls.length < 4 && (
                        <button type="button" onClick={triggerFileInput} className="aspect-square border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-cyan-400 transition-colors">
                            <AddImagePlaceholderIcon className="w-8 h-8 text-gray-500" />
                        </button>
                    )}
                </div>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                />
            </div>

            <div className="bg-[#1A1B20] p-6 rounded-lg border border-gray-800">
                <h2 className="text-lg font-bold mb-4 text-white">2. Product Details</h2>
                <div className="space-y-4">
                    <InputField label="Product Name" placeholder="e.g., Stylish Wireless Headphones" value={productName} onChange={setProductName} required />
                    <InputField label="Price (in BDT)" placeholder="12500" value={price} onChange={setPrice} type="number" required icon={<span className="text-gray-400 font-semibold">৳</span>} />
                    <TextareaField label="Description" placeholder="Describe your product in detail..." value={description} onChange={setDescription} />
                </div>
            </div>

            <div className="bg-[#1A1B20] p-6 rounded-lg border border-gray-800">
                <h2 className="text-lg font-bold mb-4 text-white">3. Specifications</h2>
                <div className="space-y-4">
                    <SelectField label="Category" value={category} onChange={setCategory}>
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home Goods">Home Goods</option>
                        <option value="Other">Other</option>
                    </SelectField>
                    <InputField label="Size (optional)" placeholder="e.g., M, L, XL or 42, 43" value={size} onChange={setSize} />
                    <InputField label="Color (optional)" placeholder="e.g., Red, Blue, Black" value={color} onChange={setColor} />
                    <RadioGroup label="Condition" name="condition" options={['New', 'Used']} selected={condition} onChange={(val) => setCondition(val as 'New' | 'Used')} />
                </div>
            </div>

            <div className="bg-[#1A1B20] p-6 rounded-lg border border-gray-800">
                <h2 className="text-lg font-bold mb-4 text-white">4. Delivery Details</h2>
                <div className="space-y-4">
                    <InputField label="Location" placeholder="e.g., Dhaka" value={location} onChange={setLocation} icon={<LocationPinIcon/>} />
                    <SelectField label="Delivery Option" value={deliveryOption} onChange={setDeliveryOption}>
                        <option value="Courier">Courier</option>
                        <option value="Hand To-Hand">Hand To-Hand</option>
                    </SelectField>
                    <RadioGroup label="Delivery Charge" name="deliveryCharge" options={['Included in price', 'Separate charge']} selected={deliveryCharge === 'Included' ? 'Included in price' : 'Separate charge'} onChange={(val) => setDeliveryCharge(val === 'Included in price' ? 'Included' : 'Separate')} />
                </div>
            </div>
            
             <div className="p-2 sticky bottom-0 bg-[#0D0F13]/80 backdrop-blur-sm">
                 <button type="submit" className="w-full bg-gradient-to-tr from-cyan-400 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                    Publish Product
                </button>
            </div>
        </form>
    );
};

export default ShopPostCreationPage;