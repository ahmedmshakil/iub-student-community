
import React, { useState } from 'react';
import { Product, CartItem, PaymentMethod } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from '../components/marketplace/ProductCard';
import { CheckoutModal } from '../components/marketplace/CheckoutModal';
import { Button } from '../components/common/Button';
import { ShoppingCartIcon, CloseIcon } from '../components/icons';

const MarketplacePage: React.FC = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS); // In a real app, fetch products
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    // Optionally open cart sidebar on add
    // setIsCartSidebarOpen(true); 
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };
  
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmPayment = (paymentMethod: PaymentMethod) => {
    // Mock payment confirmation
    alert(`Payment confirmed using ${paymentMethod}! Order placed for $${cartTotal.toFixed(2)}.`);
    setCart([]);
    setIsCheckoutModalOpen(false);
    setIsCartSidebarOpen(false);
  };

  const CartSidebar: React.FC = () => (
    <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isCartSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-iub-primary">Your Cart</h2>
        <Button variant="ghost" size="sm" onClick={() => setIsCartSidebarOpen(false)} aria-label="Close cart">
            <CloseIcon className="w-6 h-6" />
        </Button>
      </div>
      {cart.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center p-2 border border-gray-200 rounded-md">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded mr-3"/>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                  <p className="text-xs text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                  <div className="flex items-center mt-1">
                    <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-0.5 text-sm">-</Button>
                    <span className="mx-2 text-sm">{item.quantity}</span>
                    <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 text-sm">+</Button>
                  </div>
                </div>
                <p className="font-semibold text-iub-primary">${(item.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-700" aria-label="Remove item">
                  <CloseIcon className="w-4 h-4"/>
                </Button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold text-iub-primary">${cartTotal.toFixed(2)}</span>
            </div>
            <Button onClick={() => { setIsCheckoutModalOpen(true); }} className="w-full" disabled={cart.length === 0}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );


  return (
    <div className="relative min-h-screen">
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-iub-primary mb-2">Marketplace</h1>
        <p className="text-gray-600">Find great deals on used items from fellow students.</p>
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-iub-primary focus:border-iub-primary"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-iub-primary focus:border-iub-primary md:w-auto w-full"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No products found matching your criteria.</p>
        </div>
      )}

      <Button 
        onClick={() => setIsCartSidebarOpen(true)}
        className="fixed bottom-6 right-6 z-40 !rounded-full !p-4 shadow-lg"
        aria-label="Open cart"
      >
        <ShoppingCartIcon className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-iub-secondary text-white text-xs rounded-full px-1.5 py-0.5">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </Button>

      <CartSidebar />
      
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cart}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};

export default MarketplacePage;
