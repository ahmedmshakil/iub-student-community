
import React from 'react';
import { Product } from '../../types';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { ShoppingCartIcon } from '../icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={product.name}>{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">Category: {product.category}</p>
        <p className="text-sm text-gray-600 mb-3 flex-grow min-h-[40px] line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-bold text-iub-primary">${product.price.toFixed(2)}</p>
          <div className="flex items-center text-xs text-gray-500">
            <Avatar name={product.seller.name} size="sm" className="mr-1.5" />
            <span>{product.seller.name}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3">Posted: {product.postDate.toLocaleDateString()}</p>
        
        <Button 
          onClick={() => onAddToCart(product)} 
          className="w-full mt-auto"
          leftIcon={<ShoppingCartIcon className="w-4 h-4" />}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
