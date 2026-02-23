'use client';

import './CartIcon.css';

const CART_COUNT = 2;

function CartIcon() {
  return (
    <button className="cart-icon" aria-label={`Carrito de compras, ${CART_COUNT} artículos`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="cart-icon__badge" aria-hidden="true">{CART_COUNT}</span>
    </button>
  );
}

export default CartIcon;
