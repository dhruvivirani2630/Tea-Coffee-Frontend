import { Link } from "react-router-dom";

const AuthForm = ({
  mode,
  values,
  errors = {},
  loading,
  message,
  onChange,
  onSubmit,
}) => {
  const isSignup = mode === "signup";

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {message && <div className="alert error">{message}</div>}

      {isSignup && (
        <>
          <Field label="Full Name" name="fullName" value={values.fullName} error={errors.fullName} onChange={onChange} />
          <Field
            label="Employee ID"
            name="employeeId"
            value={values.employeeId}
            error={errors.employeeId}
            onChange={onChange}
          />
          <Field label="Email" name="email" value={values.email} error={errors.email} onChange={onChange} />
          <Field label="Phone Number" name="phone" value={values.phone} error={errors.phone} onChange={onChange} />
        </>
      )}

      {!isSignup && (
        <Field
          label="Email or Phone Number"
          name="identifier"
          value={values.identifier}
          error={errors.identifier}
          onChange={onChange}
        />
      )}

      <Field
        label="Password"
        name="password"
        type="password"
        value={values.password}
        error={errors.password}
        onChange={onChange}
      />

      <button className="button primary full" type="submit" disabled={loading}>
        {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
      </button>

      {!isSignup && (
        <Link className="link-muted" to="/forgot-password">
          Forgot password?
        </Link>
      )}
    </form>
  );
};

export const Field = ({ label, name, value, error, onChange, type = "text", disabled = false }) => (
  <label className="field">
    <span>{label}</span>
    <input
      name={name}
      type={type}
      value={value || ""}
      disabled={disabled}
      onChange={(event) => onChange(name, event.target.value)}
      aria-invalid={Boolean(error)}
    />
    {error && <small>{error}</small>}
  </label>
);

export default AuthForm;
