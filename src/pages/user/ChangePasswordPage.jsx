import { useState } from "react";
import PasswordForm from "../../components/forms/PasswordForm";
import { changeCurrentUserPassword } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const initialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordPage = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.status === "loading");
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSuccess("");
    setMessage("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(changeCurrentUserPassword(values)).unwrap();
      setValues(initialValues);
      setSuccess("Password updated successfully.");
    } catch (err) {
      setErrors(err?.errors || {});
      setMessage(err?.message || "Unable to update password.");
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Change Password</h1>
          <p>Verify your current password before saving a new one.</p>
        </div>
      </div>

      {message && <div className="alert error">{message}</div>}
      <PasswordForm values={values} errors={errors} loading={loading} success={success} onChange={onChange} onSubmit={onSubmit} />
    </section>
  );
};

export default ChangePasswordPage;
