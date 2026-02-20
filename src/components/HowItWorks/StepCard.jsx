import './StepCard.css';

function StepCard({ step }) {
  return (
    <div className="step-card">
      <div className="step-card__number">{step.number}</div>
      <div className="step-card__body">
        <p className="step-card__title">{step.title}</p>
        <p className="step-card__description">{step.description}</p>
      </div>
    </div>
  );
}

export default StepCard;
