import StepCard from './StepCard';
import './HowItWorks.css';

const steps = [
  {
    number: 1,
    title: 'Elige un negocio',
    description: 'y lo que quieras comprar.',
  },
  {
    number: 2,
    title: 'Compra de forma',
    description: 'directa y transparente.',
  },
  {
    number: 3,
    title: 'Recibe tu producto sin costo',
    description: 'a través de Inter Rapidísimo.',
  },
  {
    number: 4,
    title: 'Tu compra llega y el negocio',
    description: 'recibe ingresos para seguir de pie.',
  },
];

function HowItWorks({ sectionRef }) {
  return (
    <section className="how-it-works" ref={sectionRef} id="como-funciona">
      <h2 className="how-it-works__title">Así ayudaremos a Córdoba</h2>
      <div className="how-it-works__steps">
        {steps.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
