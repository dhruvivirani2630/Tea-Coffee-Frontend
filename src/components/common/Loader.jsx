const Loader = ({ label = "Loading" }) => (
  <div className="loader" role="status" aria-live="polite">
    <span className="spinner" />
    <span>{label}</span>
  </div>
);

export default Loader;
