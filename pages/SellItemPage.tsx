
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input, TextArea } from '../components/common/Input';
import { MOCK_PRODUCTS } from '../constants'; // For categories example
import { CameraIcon } from '../components/icons';

const SellItemPage: React.FC = () => {
  const { user } = useAuth();
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // For actual file handling if needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  // Example categories, could be dynamic
  const categories = ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))].filter(c => c !== 'All');


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubmissionMessage("You must be logged in to sell items.");
      return;
    }
    if (!itemName || !description || !price || !category || !imageFile) {
        setSubmissionMessage("Please fill all fields and upload an image.");
        return;
    }

    setIsSubmitting(true);
    setSubmissionMessage(null);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log({
      seller: user.id,
      itemName,
      description,
      price: parseFloat(price),
      category,
      imageName: imageFile.name, // Or actual image upload
    });
    
    setIsSubmitting(false);
    setSubmissionMessage(`Item "${itemName}" listed successfully! It will appear in the marketplace shortly.`);
    // Reset form
    setItemName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-iub-primary mb-6 border-b pb-3">Sell Your Item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Item Name"
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="e.g., Slightly Used Textbook"
          required
        />
        <TextArea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about the item's condition, edition, etc."
          rows={4}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Price ($)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 25.00"
            min="0.01"
            step="0.01"
            required
          />
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-iub-primary focus:border-iub-primary sm:text-sm"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
               <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto object-contain rounded-md"/>
              ) : (
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-iub-primary hover:text-iub-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-iub-primary"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" required/>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        {submissionMessage && (
          <p className={`text-sm p-3 rounded-md ${submissionMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submissionMessage}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Listing Item...' : 'List Item for Sale'}
        </Button>
      </form>
    </div>
  );
};

export default SellItemPage;
