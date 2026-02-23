'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import Navbar from '../Navbar/Navbar';
import './Checkout.css';

const DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
  'Vaupés', 'Vichada',
];

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

const REQUIRED_FIELDS = ['email', 'firstName', 'lastName', 'cedula', 'cedNum', 'phone', 'department', 'city', 'address'];

export default function CheckoutForm() {
  const router = useRouter();
  const { items, total, updateQuantity, clearCart } = useCart();

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    cedula: 'Cédula de ciudadanía', cedNum: '',
    phone: '', department: '', city: '', address: '',
    sameAddress: true, acceptTerms: false, acceptData: false,
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((e) => { const n = { ...e }; delete n[name]; return n; });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido';
    if (!form.firstName.trim()) newErrors.firstName = 'Requerido';
    if (!form.lastName.trim()) newErrors.lastName = 'Requerido';
    if (!form.cedNum.trim()) newErrors.cedNum = 'Requerido';
    if (!form.phone.trim()) newErrors.phone = 'Requerido';
    if (!form.department) newErrors.department = 'Requerido';
    if (!form.city.trim()) newErrors.city = 'Requerido';
    if (!form.address.trim()) newErrors.address = 'Requerido';
    if (!form.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setProcessing(true);
    // Simulate processing
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    router.push('/checkout/confirmation');
  };

  if (items.length === 0 && !processing) {
    return (
      <div className="checkout">
        <Navbar />
        <main className="checkout__empty">
          <p>Tu carrito está vacío.</p>
          <button className="checkout__back-btn" onClick={() => router.push('/')}>Volver al inicio</button>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout">
      <Navbar />
      <main className="checkout__main">
        <h1 className="checkout__title">Finalizar compra</h1>
        <form className="checkout__grid" onSubmit={handleSubmit} noValidate>

          {/* Column 1: Address */}
          <section className="checkout__col checkout__col--address" aria-labelledby="address-title">
            <h2 className="checkout__col-title" id="address-title">Mis direcciones</h2>

            <div className="checkout__field checkout__field--full">
              <label className="checkout__label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className={`checkout__input${errors.email ? ' checkout__input--error' : ''}`}
                value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
              {errors.email && <span className="checkout__error">{errors.email}</span>}
            </div>

            <div className="checkout__row">
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="firstName">Nombre</label>
                <input id="firstName" name="firstName" type="text" className={`checkout__input${errors.firstName ? ' checkout__input--error' : ''}`}
                  value={form.firstName} onChange={handleChange} placeholder="Nombre" />
                {errors.firstName && <span className="checkout__error">{errors.firstName}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="lastName">Apellido</label>
                <input id="lastName" name="lastName" type="text" className={`checkout__input${errors.lastName ? ' checkout__input--error' : ''}`}
                  value={form.lastName} onChange={handleChange} placeholder="Apellido" />
                {errors.lastName && <span className="checkout__error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="checkout__row">
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="cedula">Tipo de identificación</label>
                <select id="cedula" name="cedula" className="checkout__input checkout__select"
                  value={form.cedula} onChange={handleChange}>
                  <option>Cédula de ciudadanía</option>
                  <option>Cédula de extranjería</option>
                  <option>Pasaporte</option>
                  <option>NIT</option>
                </select>
              </div>
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="cedNum">Número de identificación</label>
                <input id="cedNum" name="cedNum" type="text" className={`checkout__input${errors.cedNum ? ' checkout__input--error' : ''}`}
                  value={form.cedNum} onChange={handleChange} placeholder="Número" />
                {errors.cedNum && <span className="checkout__error">{errors.cedNum}</span>}
              </div>
            </div>

            <div className="checkout__row">
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="phone">Teléfono</label>
                <input id="phone" name="phone" type="tel" className={`checkout__input${errors.phone ? ' checkout__input--error' : ''}`}
                  value={form.phone} onChange={handleChange} placeholder="3001234567" />
                {errors.phone && <span className="checkout__error">{errors.phone}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="department">Departamento</label>
                <select id="department" name="department" className={`checkout__input checkout__select${errors.department ? ' checkout__input--error' : ''}`}
                  value={form.department} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className="checkout__error">{errors.department}</span>}
              </div>
            </div>

            <div className="checkout__row">
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="city">Ciudad</label>
                <input id="city" name="city" type="text" className={`checkout__input${errors.city ? ' checkout__input--error' : ''}`}
                  value={form.city} onChange={handleChange} placeholder="Ciudad" />
                {errors.city && <span className="checkout__error">{errors.city}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label" htmlFor="address">Dirección</label>
                <input id="address" name="address" type="text" className={`checkout__input${errors.address ? ' checkout__input--error' : ''}`}
                  value={form.address} onChange={handleChange} placeholder="Calle, Carrera, etc." />
                {errors.address && <span className="checkout__error">{errors.address}</span>}
              </div>
            </div>

            <label className={`checkout__checkbox${errors.acceptTerms ? ' checkout__checkbox--error' : ''}`}>
              <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={handleChange} />
              <span>Acepto los <a href="#" className="checkout__link">Términos y Condiciones</a></span>
            </label>
            {errors.acceptTerms && <span className="checkout__error">{errors.acceptTerms}</span>}

            <label className="checkout__checkbox">
              <input type="checkbox" name="acceptData" checked={form.acceptData} onChange={handleChange} />
              <span>Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad</span>
            </label>
          </section>

          {/* Column 2: Shipping & Payment */}
          <section className="checkout__col checkout__col--payment" aria-labelledby="payment-title">
            <h2 className="checkout__col-title" id="payment-title">Método de envío y pago</h2>

            <div className="checkout__section-label">Método de envío</div>
            <div className="checkout__shipping-card">
              <div className="checkout__shipping-radio">
                <span className="checkout__radio-dot" aria-hidden="true" />
              </div>
              <div className="checkout__shipping-info">
                <span className="checkout__shipping-name">Inter Rapidísimo</span>
                <span className="checkout__shipping-price">$0 — Gratis</span>
              </div>
            </div>

            <div className="checkout__section-label" style={{ marginTop: '24px' }}>Métodos de pago</div>
            <div className="checkout__payment-card">
              <p className="checkout__payment-text">Pago en línea PSE y tarjetas de crédito</p>
              <div className="checkout__payment-logos" aria-label="Métodos de pago aceptados">
                {['Nequi', 'ADDI', 'VISA', 'Mastercard', 'Google Pay', 'Apple Pay'].map((m) => (
                  <span key={m} className="checkout__payment-logo">{m}</span>
                ))}
              </div>
            </div>

            <label className="checkout__toggle-row">
              <input type="checkbox" name="sameAddress" checked={form.sameAddress} onChange={handleChange} />
              <span>La dirección de envío y facturación son la misma</span>
            </label>
          </section>

          {/* Column 3: Order summary */}
          <section className="checkout__col checkout__col--summary" aria-labelledby="summary-title">
            <h2 className="checkout__col-title" id="summary-title">Sus artículos y envío</h2>

            <ul className="checkout__items" aria-label="Artículos en el carrito">
              {items.map(({ product, quantity: qty }) => (
                <li key={product.id} className="checkout__item">
                  <img className="checkout__item-img" src={product.image} alt={product.name} />
                  <div className="checkout__item-info">
                    <p className="checkout__item-name">{product.name}</p>
                    <p className="checkout__item-shipping">Envío por Inter Rapidísimo</p>
                    <div className="checkout__item-qty" role="group" aria-label={`Cantidad de ${product.name}`}>
                      <button type="button" className="checkout__qty-btn" onClick={() => updateQuantity(product.id, qty - 1)} aria-label="Reducir">−</button>
                      <span aria-live="polite">{qty}</span>
                      <button type="button" className="checkout__qty-btn" onClick={() => updateQuantity(product.id, qty + 1)} aria-label="Aumentar">+</button>
                    </div>
                  </div>
                  <p className="checkout__item-price">{formatPrice(product.price * qty)}</p>
                </li>
              ))}
            </ul>

            <hr className="checkout__divider" />

            <div className="checkout__summary">
              <div className="checkout__summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="checkout__summary-row">
                <span>Costo de envío</span>
                <span>$0</span>
              </div>
              <hr className="checkout__divider" />
              <div className="checkout__summary-row checkout__summary-row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button type="submit" className="checkout__pay-btn" disabled={processing} aria-busy={processing}>
              {processing ? 'Procesando…' : 'Pagar'}
            </button>
            <p className="checkout__legal">
              Al realizar tu pago aceptas nuestros términos y condiciones. Tu información está protegida con cifrado SSL.
            </p>
          </section>
        </form>
      </main>
    </div>
  );
}
