export default function Legend() {
  return (
    <ul className="legend">
      <li className="legend__item">
        <span className="legend__dot legend__dot--available" aria-hidden="true" />
        Available
      </li>
      <li className="legend__item">
        <span className="legend__dot legend__dot--selected" aria-hidden="true" />
        Your selection
      </li>
      <li className="legend__item">
        <span className="legend__dot legend__dot--booked" aria-hidden="true" />
        Booked
      </li>
    </ul>
  );
}
