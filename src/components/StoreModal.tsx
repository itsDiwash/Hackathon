import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, ShoppingBag, Star, Check, ShieldCheck, Tag } from 'lucide-react';
import { GearItem } from '../types';
import { GEAR_CATALOG } from '../data/mockData';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (gear: GearItem) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onOpenCart,
  cartCount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const categories = [
    'All',
    'Packs',
    'Hardware',
    'Camp & Sleep',
    'Footwear',
    'Apparel',
    'Navigation & Safety',
  ];

  const filteredGear = GEAR_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddWithFeedback = (item: GearItem) => {
    onAddToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="store-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-6xl bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="store-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff9e30]/10 border border-[#ff9e30]/30 text-[#ff9e30]">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
                Expedition Gear & Alpine Hardware
              </h2>
              <p className="text-xs text-zinc-400 font-inter">
                Tested by certified mountain guides on Annapurna, Mont Blanc & Patagonia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="cursor-pointer relative flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-inter font-bold text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#ff9e30]" />
              <span>Cart ({cartCount})</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
              id="close-store-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 bg-[#0a0a0a] border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-inter font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#ff9e30] text-black shadow-sm'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gear, tents, boots..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-[#090909]">
          {filteredGear.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h4 className="font-oswald text-lg text-white uppercase font-bold">
                No Mountain Equipment Found
              </h4>
              <p className="text-xs text-zinc-400 font-inter mt-1">
                Try selecting another category or refining your search keywords.
              </p>
            </div>
          ) : (
            filteredGear.map((item) => {
              const isAdded = !!addedItemIds[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all group"
                >
                  {/* Image & Badge */}
                  <div className="relative h-48 bg-zinc-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#ff9e30] text-black text-[10px] font-bold font-inter uppercase tracking-wider shadow">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-zinc-300 text-[10px] font-inter flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#ff9e30] fill-[#ff9e30]" />
                      <span>{item.rating} ({item.reviews})</span>
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#ff9e30] uppercase font-oswald tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="font-oswald text-base font-bold text-white tracking-wide mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-400 font-inter mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-3 space-y-1">
                        {item.specs.slice(0, 2).map((spec, sIdx) => (
                          <div key={sIdx} className="text-[11px] text-zinc-400 font-inter flex items-center gap-1.5">
                            <span className="text-[#ff9e30]">•</span>
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-inter block">MSRP</span>
                        <span className="font-anton text-xl text-white tracking-wide">
                          ${item.price}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddWithFeedback(item)}
                        className={`cursor-pointer inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-oswald font-bold uppercase tracking-wider transition-all shadow-sm ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-[#ff9e30] hover:bg-[#ffb04f] text-black active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="px-6 py-3 bg-[#121212] border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs font-inter text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff9e30]" />
            <span>All gear backed by our 100% Extreme Weather & Lifetime Durability Guarantee</span>
          </div>
          <span className="text-[#ff9e30] font-semibold">Free Worldwide Expedition Shipping over $150</span>
        </div>
      </motion.div>
    </div>
  );
};
