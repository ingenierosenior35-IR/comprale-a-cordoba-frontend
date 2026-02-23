'use client';

import { useRouter } from 'next/navigation';
import './confirmation.css';

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="confirm">
      <div className="confirm__card">
        <div className="confirm__icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <h1 className="confirm__title">¡Gracias por tu compra!</h1>
        <p className="confirm__subtitle">Tu pedido ha sido recibido y está siendo procesado.</p>
        <p className="confirm__shipping">
          Tu pedido será enviado a través de <strong>Inter Rapidísimo</strong>.
        </p>
        <button
          className="confirm__btn"
          onClick={() => router.push('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
