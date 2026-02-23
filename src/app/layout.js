import '../styles/globals.css';
import '../index.css';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Cómprale a Córdoba',
  description: 'Conectando compradores con negocios locales del departamento de Córdoba, Colombia.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ReactQueryProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
