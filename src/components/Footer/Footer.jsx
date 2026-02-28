import Image from 'next/image';
import './Footer.css';

const SUPPORT_LOGOS = [
  { src: '/brand/gobernacion-cordoba.png', alt: 'Gobernación de Córdoba' },
  { src: '/brand/fundaccion.png', alt: 'FundAcción' },
];

const MEDIA_LOGOS = [
  { src: '/brand/el-titular.png', alt: 'El Titular' },
  { src: '/brand/rp-latam.png', alt: 'RP Latam' },
];

function Footer({ sponsors }) {
  const showSupport = SUPPORT_LOGOS.length > 0 || (sponsors?.length ?? 0) > 0;
  const showMedia = MEDIA_LOGOS.length > 0;

  return (
    <footer className="footer" aria-label="Pie de página">
      <div className="footer__rule" />

      <div className="footer__container">
        <div className="footer__organizer">
          <span className="footer__organizer-label">Organiza:</span>
          <Image
            src="/brand/interrapidisimo.svg"
            alt="Inter Rapidísimo"
            className="footer__organizer-logo"
            width={190}
            height={48}
            priority={false}
          />
        </div>
      </div>

      <div className="footer__rule" />

      <div className="footer__row footer__row--bleed" aria-label="Aliados y medios">
        <div className="footer__row-inner">
          {showSupport ? <span className="footer__row-label">Apoya:</span> : null}

          <div className="footer__row-logos" aria-label="Logos">
            {SUPPORT_LOGOS.map((logo) => (
              <div className="footer__logo" key={logo.src} title={logo.alt}>
                <img src={logo.src} alt={logo.alt} className="footer__logo-img" loading="lazy" />
              </div>
            ))}

            {sponsors?.length > 0
              ? sponsors.map((s) => (
                  <div className="footer__logo" key={s.id} title={s.name}>
                    <img src={s.logo} alt={s.name} className="footer__logo-img" loading="lazy" />
                  </div>
                ))
              : null}

            {showSupport && showMedia ? <span className="footer__divider" aria-hidden="true" /> : null}

            {showSupport && showMedia ? (
              <span className="footer__row-label footer__row-label--inline">Medios aliados:</span>
            ) : null}

            {MEDIA_LOGOS.map((logo) => (
              <div className="footer__logo" key={logo.src} title={logo.alt}>
                <img src={logo.src} alt={logo.alt} className="footer__logo-img" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__rule" />

      <div className="footer__container">
        <div className="footer__links footer__links--withBottomSpace" aria-label="Enlaces del pie de página">
          <div className="footer__links-head">
            <h4 className="footer__links-title">Servicio al cliente</h4>
            <h4 className="footer__links-title">Aliados</h4>
          </div>

          <div className="footer__links-grid">
            <a className="footer__link" href="/terminos-usuario" target="_self" rel="noreferrer">
              Términos y condiciones del usuario
            </a>

            <a className="footer__link" href="#" target="_self" rel="noreferrer">
              Términos y condiciones del seller
            </a>

            <a className="footer__link" href="https://www.sic.gov.co/" target="_blank" rel="noopener noreferrer">
              Superintendencia Industria y Comercio
            </a>

            <a className="footer__link" href="https://sicfacilita.sic.gov.co/SICFacilita/index.xhtml" target="_blank" rel="noopener noreferrer">
              SIC facilita
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;