"use client";

import { useCart } from "@/app/_components/cart/cart-context";

export default function TestCartPage() {
  const { addToCart, items, openCart } = useCart();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cart Test Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={() => addToCart({
            name: "Test Product 1",
            price: "₹299.00",
          })}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Test Product 1
        </button>
        
        <button
          onClick={() => addToCart({
            name: "Test Product 2", 
            price: "₹399.00",
          })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Test Product 2
        </button>
        
        <button
          onClick={openCart}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Open Cart
        </button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Cart Items ({items.length})</h2>
        <ul className="list-disc pl-5">
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.price} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
