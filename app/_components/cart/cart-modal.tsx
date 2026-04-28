"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MdAdd, MdDeleteOutline, MdRemove } from "react-icons/md";

export type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: StaticImageData;
};

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
};

export function CartModal({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartModalProps) {
  const subtotal = items.reduce((total, item) => {
    const price = parseFloat(item.price.replace("₹", "").replace(",", ""));
    return total + price * item.quantity;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 40;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Cart Panel */}
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-xl font-bold text-[#142331]">
                  Your Cart
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    {items.map((item) => (
                      <CartItemComponent
                        key={item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t px-6 py-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0
                          ? "FREE"
                          : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>
                        ₹{(subtotal + shipping).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={onClose}
                      className="w-full rounded-full border border-[#6ead3d] px-6 py-3 text-xs font-extrabold uppercase text-[#6ead3d] hover:bg-[#6ead3d] hover:text-white"
                    >
                      Continue Shopping
                    </button>
                    <button className="w-full rounded-full bg-[#6ead3d] px-6 py-3 text-xs font-extrabold uppercase text-white hover:bg-[#5e9d31]">
                      View Cart
                    </button>
                    <button className="w-full rounded-full bg-[#ff6b35] px-6 py-3 text-xs font-extrabold uppercase text-white hover:bg-[#e55a2b]">
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type CartItemProps = {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
};

function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 rounded-lg border p-4"
    >
      <div className="h-16 w-16 overflow-hidden rounded">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold">{item.name}</h3>
        <p className="text-sm font-medium text-[#ff6b35]">
          {item.price}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="h-8 w-8 rounded-full border flex items-center justify-center"
          >
            <MdRemove />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() =>
              onUpdateQuantity(item.id, item.quantity + 1)
            }
            className="h-8 w-8 rounded-full border flex items-center justify-center"
          >
            <MdAdd />
          </button>
        </div>
      </div>

      <button
        onClick={() => onRemoveItem(item.id)}
        className="text-red-500"
      >
        <MdDeleteOutline  />
      </button>
    </motion.div>
  );
}