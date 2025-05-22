
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants'; // Assuming this contains products listed by users
import { ProductCard } from '../components/marketplace/ProductCard'; // Re-use for display

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth(); // Assuming login function can also update user details if extended
  const [isEditing, setIsEditing] = useState(false);
  // Mock user's listed items
  const [userItems] = useState<Product[]>(() => 
    MOCK_PRODUCTS.filter(p => p.seller.email === user?.email) // Filter by logged-in user
  );

  // Form state for editing profile (very basic example)
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');

  if (!user) {
    return <p>Loading profile...</p>; // Or redirect to login
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form fields if cancelling edit
    if (isEditing) {
      setDisplayName(user.name);
      setContactEmail(user.email);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, call an API to update user details
    // For this mock, we can update the auth context if login function is extended
    // or just show an alert.
    // await login(user.studentId, contactEmail, displayName); // This would re-trigger auth flow
    alert("Profile update mocked. In a real app, this would save to a backend.");
    // Potentially update user object in AuthContext if login function could do this
    // For now, we assume user object in context might not immediately reflect this local change
    // without a full re-login or a dedicated updateUser function in AuthContext.
    setIsEditing(false);
  };

  const handleMockAddToCart = (product: Product) => {
    alert(`Mock: ${product.name} added to cart (from Profile page).`);
  };


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <Avatar name={user.name} src={`https://picsum.photos/seed/${user.id}/150/150`} size="lg" className="w-24 h-24 md:w-32 md:h-32 text-4xl mb-4 md:mb-0 md:mr-6 ring-4 ring-iub-primary/30" />
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input 
                  label="Display Name" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  containerClassName="!mb-2"
                />
                <Input 
                  label="Contact Email" 
                  type="email" 
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)}
                  containerClassName="!mb-2"
                />
                <div className="flex space-x-2 mt-2 justify-center md:justify-start">
                  <Button type="submit" size="sm">Save Changes</Button>
                  <Button variant="ghost" size="sm" onClick={handleEditToggle}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-iub-primary">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 text-sm">Student ID: {user.studentId}</p>
                <Button onClick={handleEditToggle} size="sm" variant="ghost" className="mt-3">
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-iub-primary mb-4 border-b pb-2">Your Listed Items</h2>
        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map(item => (
              <ProductCard key={item.id} product={item} onAddToCart={handleMockAddToCart} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't listed any items for sale yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
