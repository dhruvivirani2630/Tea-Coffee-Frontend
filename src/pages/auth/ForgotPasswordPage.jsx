import { Link } from "react-router-dom";

const ForgotPasswordPage = () => (
  <main className="auth-page">
    <section className="auth-card">
      <h1>Forgot Password</h1>
      <p>This screen is UI only. Connect it to your reset-password API when the backend is ready.</p>
      <form className="auth-form">
        <label className="field">
          <span>Email or Phone Number</span>
          <input placeholder="name@company.com or 9876543210" />
        </label>
        <button className="button primary full" type="button">
          Send reset link
        </button>
      </form>
      <p className="auth-switch">
        <Link to="/login">Back to login</Link>
      </p>
    </section>
  </main>
);

export default ForgotPasswordPage;
