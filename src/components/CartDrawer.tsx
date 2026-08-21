import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.gear.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    const id = `TB-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(id);
    setCheckoutDone(true);
  };

  const handleResetCheckout = () => {
    setCheckoutDone(false);
    onClearCart();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
      id="cart-drawer-overlay"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md bg-[#0e0e0e] border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl"
        id="cart-drawer"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#ff9e30]" />
            <h3 className="font-oswald text-lg font-bold tracking-wider text-white uppercase">
              Expedition Gear Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
            id="close-cart-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Modal Confirmation State */}
        {checkoutDone ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#ff9e30]/10 border border-[#ff9e30] flex items-center justify-center text-[#ff9e30] mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs text-[#ff9e30] font-oswald uppercase tracking-widest font-bold">
              Expedition Manifest Confirmed
            </span>
            <h4 className="font-oswald text-2xl font-bold text-white uppercase mt-1">
              Order #{orderId}
            </h4>
            <p className="text-xs text-zinc-400 font-inter max-w-xs mt-2 leading-relaxed">
              Your alpine equipment is being packed and dispatched with priority weather-sealed courier tracking.
            </p>
            <button
              onClick={handleResetCheckout}
              className="mt-6 cursor-pointer rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-8 py-3 text-xs font-oswald font-bold uppercase tracking-wider text-black transition-all shadow-md active:scale-95"
            >
              Continue Exploring Trails
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Meter */}
            <div className="p-4 bg-[#141414] border-b border-zinc-800 text-xs font-inter">
              <div className="flex justify-between text-zinc-300 mb-1.5 font-medium">
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-[#ff9e30] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Free Expedition Basecamp Shipping Unlocked!
                  </span>
                ) : (
                  <span>
                    Add ${(freeShippingThreshold - subtotal).toFixed(0)} more for Free Shipping
                  </span>
                )}
                <span>${subtotal.toFixed(0)} / ${freeShippingThreshold}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff9e30] transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-zinc-600 mb-3" />
                  <p className="font-oswald text-lg font-bold text-white uppercase">
                    Your Gear Bag is Empty
                  </p>
                  <p className="text-xs text-zinc-400 font-inter max-w-xs mt-1">
                    Explore our alpine store to equip high-performance packs, boots, and expedition hardware.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.gear.id}
                    className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex gap-3 items-center"
                  >
                    <img
                      src={item.gear.image}
                      alt={item.gear.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-zinc-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-oswald text-sm font-bold text-white truncate">
                        {item.gear.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="font-anton text-base text-[#ff9e30]">
                          ${item.gear.price}
                        </span>
                        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.gear.id, -1)}
                            className="p-0.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.gear.id, 1)}
                            className="p-0.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.gear.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-zinc-800 bg-[#121212] space-y-3">
                <div className="space-y-1.5 text-xs font-inter">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Expedition Dispatch Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Total Estimated</span>
                    <span className="text-[#ff9e30] font-anton text-lg">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#ff9e30]" />
                  <span>3-Year Mountain Guarantee & Free Returns</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full cursor-pointer rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] py-3.5 font-oswald text-sm font-bold uppercase tracking-wider text-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  id="checkout-cart-btn"
                >
                  <span>Proceed to Alpine Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};
