import { Field } from "./AuthForm";

const PasswordForm = ({ values, errors = {}, loading, success, onChange, onSubmit }) => (
  <form className="panel form-grid" onSubmit={onSubmit} noValidate>
    {success && <div className="alert success">{success}</div>}

    <Field
      label="Current Password"
      name="currentPassword"
      type="password"
      value={values.currentPassword}
      error={errors.currentPassword}
      onChange={onChange}
    />
    <Field
      label="New Password"
      name="newPassword"
      type="password"
      value={values.newPassword}
      error={errors.newPassword}
      onChange={onChange}
      hint="8+ chars with uppercase, lowercase, number, and symbol."
    />
    <Field
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      value={values.confirmPassword}
      error={errors.confirmPassword}
      onChange={onChange}
    />

    <button className="button primary" type="submit" disabled={loading}>
      {loading ? "Updating..." : "Change password"}
    </button>
  </form>
);

export default PasswordForm;
