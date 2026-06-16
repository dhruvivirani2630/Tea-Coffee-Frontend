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
    <Field label="Full Name" name="name" value={values.name} error={errors.name} onChange={onChange} />
    <Field
      label="Employee ID"
      name="employeeId"
      value={values.employeeId}
      error={errors.employeeId}
      onChange={onChange}
    />
    <Field label="Email" name="email" value={values.email} error={errors.email} onChange={onChange} />
    <Field label="Phone Number" name="phone" value={values.phone} error={errors.phone} onChange={onChange} />

 <label className="field">
  <span>Role</span>
  <input value={values.role || ""} readOnly />
</label>

<label className="field">
  <span>Status</span>
  <input value={values.status || ""} readOnly />
</label>
    <button className="button primary" type="submit" disabled={loading}>
      {loading ? "Saving..." : "Save changes"}
    </button>
  </form>
);

export default ProfileForm;
