"use client";

import type { ReactNode } from "react";

import { SiteFooter } from "@/app/_components/layout/site-footer";
import { SiteHeader } from "@/app/_components/layout/site-header";
import { CartProvider, useCart } from "@/app/_components/cart/cart-context";
import { CartModal } from "@/app/_components/cart/cart-modal";

type SiteShellProps = {
  children: ReactNode;
};

function SiteShellContent({ children }: SiteShellProps) {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartModal
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </>
  );
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <CartProvider>
      <SiteShellContent>{children}</SiteShellContent>
    </CartProvider>
  );
}
