import { Field } from "./AuthForm";
import { ROLES, STATUS } from "../../constants/roles";

const ProfileForm = ({
  values,
  errors = {},
  loading,
  success,
  adminMode = false,
  lockRole = true,
  onChange,
  onSubmit,
}) => (
  <form className="panel form-grid" onSubmit={onSubmit} noValidate>
    {success && <div className="alert success">{success}</div>}
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

    {adminMode && (
      <>
        <label className="field">
          <span>Role</span>
          <select value={values.role} disabled={lockRole} onChange={(event) => onChange("role", event.target.value)}>
            <option value={ROLES.USER}>User</option>
            <option value={ROLES.ADMIN}>Admin</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={values.status} onChange={(event) => onChange("status", event.target.value)}>
            <option value={STATUS.ACTIVE}>Active</option>
            <option value={STATUS.INACTIVE}>Inactive</option>
          </select>
        </label>
      </>
    )}

    {!adminMode && (
      <label className="field">
        <span>Role</span>
        <input value={values.role || ""} disabled readOnly />
      </label>
    )}

    <button className="button primary" type="submit" disabled={loading}>
      {loading ? "Saving..." : "Save changes"}
    </button>
  </form>
);

export default ProfileForm;
