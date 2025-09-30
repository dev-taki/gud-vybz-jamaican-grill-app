'use client';

import { useEffect, useState } from 'react';
import { ButtonLoader } from './common/Loader';
import { COLORS } from '../config/colors';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  variations: {
    id: string;
    name: string;
    price: number;
    currency: string;
    sku: string;
    available: boolean;
  }[];
  available: boolean;
  image_url?: string;
}

interface CartItem {
  itemId: string;
  variationId: string;
  name: string;
  variationName: string;
  price: number;
  currency: string;
  quantity: number;
}

interface MenuPurchaseFormProps {
  onSuccess: (orderId: string, paymentId: string) => void;
  onError: (error: string) => void;
}

export default function MenuPurchaseForm({ onSuccess, onError }: MenuPurchaseFormProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/square/menu');
        const data = await response.json();

        if (data.success) {
          setMenuItems(data.data.menuItems);
        } else {
          onError(data.error || 'Failed to fetch menu items');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        onError('Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [onError]);

  // Get unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  // Filter menu items by category
  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Add item to cart
  const addToCart = (item: MenuItem, variation: MenuItem['variations'][0]) => {
    if (!variation.available) return;

    const existingItem = cart.find(
      cartItem => cartItem.itemId === item.id && cartItem.variationId === variation.id
    );

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.itemId === item.id && cartItem.variationId === variation.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        itemId: item.id,
        variationId: variation.id,
        name: item.name,
        variationName: variation.name,
        price: variation.price / 100, // Convert from cents
        currency: variation.currency,
        quantity: 1,
      }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: string, variationId: string) => {
    setCart(cart.filter(item => !(item.itemId === itemId && item.variationId === variationId)));
  };

  // Update quantity
  const updateQuantity = (itemId: string, variationId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, variationId);
      return;
    }

    setCart(cart.map(item =>
      item.itemId === itemId && item.variationId === variationId
        ? { ...item, quantity }
        : item
    ));
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Process order
  const processOrder = async () => {
    if (cart.length === 0) {
      onError('Your cart is empty');
      return;
    }

    // Check Square configuration - same as SquarePaymentForm
    const SQUARE_CONFIG = {
      applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
    };
    
    console.log('Square configuration check:', {
      applicationId: SQUARE_CONFIG.applicationId,
      locationId: SQUARE_CONFIG.locationId,
      hasAppId: !!SQUARE_CONFIG.applicationId,
      hasLocationId: !!SQUARE_CONFIG.locationId
    });
    
    if (!SQUARE_CONFIG.applicationId || !SQUARE_CONFIG.locationId) {
      console.warn('Square configuration missing, using mock order processing');
      // For now, simulate successful order without Square SDK
      setTimeout(() => {
        setProcessing(false);
        onSuccess('mock-order-' + Date.now(), 'mock-payment-' + Date.now());
      }, 2000);
      return;
    }

    setProcessing(true);
    try {
      // First create the order
      const orderResponse = await fetch('/api/square/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_items: cart.map(item => ({
            name: `${item.name} - ${item.variationName}`,
            quantity: item.quantity,
            price: item.price,
            currency: item.currency,
            catalog_object_id: item.variationId,
            variation_name: item.variationName,
          })),
          customer_id: '', // You can add customer ID here
          note: 'Order from web app',
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // For now, we'll just return the order ID
      // In a real implementation, you'd integrate with Square's payment form
      onSuccess(orderData.data.order.id, '');
      
    } catch (error) {
      console.error('Error processing order:', error);
      onError(error instanceof Error ? error.message : 'Failed to process order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <ButtonLoader size="md" />
        <span className="ml-2">Loading menu...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Menu & Order</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B3B3B] focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Items' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Menu Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map(item => (
              <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
                {/* No images - text only menu */}
                
                <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                )}
                
                {item.variations.map(variation => (
                  <div key={variation.id} className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{variation.name}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ${(variation.price / 100).toFixed(2)} {variation.currency}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(item, variation)}
                      disabled={!variation.available || processing}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Your Order</h3>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.variationName}</div>
                        <div className="text-sm">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.itemId, item.variationId, item.quantity - 1)}
                          className="w-6 h-6 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.itemId, item.variationId, item.quantity + 1)}
                          className="w-6 h-6 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.itemId, item.variationId)}
                          className="w-6 h-6 bg-red-600 text-white rounded text-sm hover:bg-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={processOrder}
                    disabled={processing || cart.length === 0}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                  >
                    {processing ? (
                      <>
                        <ButtonLoader size="sm" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
