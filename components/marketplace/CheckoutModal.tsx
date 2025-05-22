
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { CartItem, PaymentMethod } from '../../types';
import { CreditCardIcon, BkashIcon } from '../icons'; // Ensure BkashIcon is defined

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onConfirmPayment: (paymentMethod: PaymentMethod) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onConfirmPayment }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setPaymentError(''); // Clear previous errors
  };

  const validatePaymentDetails = (): boolean => {
    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method.');
      return false;
    }
    if (selectedPaymentMethod === PaymentMethod.CARD) {
      if (!cardNumber.match(/^\d{16}$/)) { // Basic validation: 16 digits
        setPaymentError('Invalid card number. Must be 16 digits.');
        return false;
      }
      if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) { // MM/YY
        setPaymentError('Invalid expiry date. Use MM/YY format.');
        return false;
      }
      if (!cvv.match(/^\d{3,4}$/)) { // 3 or 4 digits
        setPaymentError('Invalid CVV. Must be 3 or 4 digits.');
        return false;
      }
    }
    if (selectedPaymentMethod === PaymentMethod.BKASH) {
      if (!bkashNumber.match(/^01\d{9}$/)) { // Bangladeshi mobile number format
        setPaymentError('Invalid bKash number. Must be a valid Bangladeshi mobile number.');
        return false;
      }
    }
    return true;
  };

  const handleConfirm = () => {
    if (validatePaymentDetails() && selectedPaymentMethod) {
      onConfirmPayment(selectedPaymentMethod);
      // Reset fields (optional, depends on desired UX after successful payment)
      // setCardNumber(''); setExpiryDate(''); setCvv(''); setBkashNumber(''); setSelectedPaymentMethod(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Your Purchase" size="lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
              <span className="text-sm text-gray-600">{item.name} (x{item.quantity})</span>
              <span className="text-sm font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-3 mt-2 border-t-2 border-iub-primary">
            <span className="text-lg font-bold text-iub-primary">Total</span>
            <span className="text-lg font-bold text-iub-primary">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Select Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={selectedPaymentMethod === PaymentMethod.CARD ? 'primary' : 'ghost'}
              onClick={() => handlePaymentMethodSelect(PaymentMethod.CARD)}
              className="border border-iub-primary w-full justify-start py-3"
              leftIcon={<CreditCardIcon className="w-6 h-6 mr-3"/>}
            >
              Credit/Debit Card
            </Button>
            <Button
              variant={selectedPaymentMethod === PaymentMethod.BKASH ? 'primary' : 'ghost'}
              onClick={() => handlePaymentMethodSelect(PaymentMethod.BKASH)}
              className="border border-iub-primary w-full justify-start py-3"
              leftIcon={<BkashIcon className="w-6 h-6 mr-3 text-pink-500"/>}
            >
              bKash
            </Button>
          </div>
        </div>

        {selectedPaymentMethod === PaymentMethod.CARD && (
          <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-700">Card Details</h4>
            <Input label="Card Number" type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date (MM/YY)" type="text" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="MM/YY" />
              <Input label="CVV" type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123" />
            </div>
          </div>
        )}

        {selectedPaymentMethod === PaymentMethod.BKASH && (
          <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-700">bKash Details</h4>
            <Input label="bKash Account Number" type="tel" value={bkashNumber} onChange={e => setBkashNumber(e.target.value)} placeholder="01XXXXXXXXX" />
            <p className="text-xs text-gray-500">You will receive a payment request on your bKash app. Enter PIN to confirm.</p>
          </div>
        )}
        
        {paymentError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{paymentError}</p>}

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedPaymentMethod}>
            Pay ${(totalAmount).toFixed(2)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
