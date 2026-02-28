import '../terms.css';
import { TERMS_AND_CONDITIONS_HTML } from '../../constants/termsAndConditions';

export const metadata = {
  title: 'Términos y condiciones del usuario',
};

export default function TerminosUsuarioPage() {
  return (
    <main className="terms-page">
      <div className="terms-page__inner">
        <h1 className="terms-page__title">Términos y condiciones del usuario</h1>

        <section
          className="terms-page__content"
          dangerouslySetInnerHTML={{ __html: TERMS_AND_CONDITIONS_HTML }}
        />
      </div>
    </main>
  );
}