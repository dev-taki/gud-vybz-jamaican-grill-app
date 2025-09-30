'use client';

import { useState } from 'react';
import MenuPurchaseForm from '../../components/MenuPurchaseForm';
import { showToast } from '../../utils/toast';

export default function MenuPage() {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<{ orderId: string; paymentId: string } | null>(null);

  const handleOrderSuccess = (orderId: string, paymentId: string) => {
    console.log('Order successful:', { orderId, paymentId });
    setOrderSuccess(true);
    setOrderData({ orderId, paymentId });
    showToast.success('Order placed successfully!');
  };

  const handleOrderError = (error: string) => {
    console.error('Order failed:', error);
    showToast.error(`Order failed: ${error}`);
  };

  if (orderSuccess && orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">
                <strong>Order ID:</strong> {orderData.orderId}
              </p>
              {orderData.paymentId && (
                <p className="text-sm text-gray-600">
                  <strong>Payment ID:</strong> {orderData.paymentId}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setOrderSuccess(false);
                  setOrderData(null);
                }}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Place Another Order
              </button>
              
              <button
                onClick={() => window.location.href = '/home'}
                className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <MenuPurchaseForm
        onSuccess={handleOrderSuccess}
        onError={handleOrderError}
      />
    </div>
  );
}
