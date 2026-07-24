import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm";
import { ROLES } from "../../constants/roles";
import { signupUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { validateAuth } from "../../utils/validators";

const initialValues = {
  fullName: "",
  employeeId: "",
  email: "",
  phone: "",
  password: "",
};

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  if (user) return <Navigate to={user.role === ROLES.ADMIN ? "/admin" : "/dashboard"} replace />;

  const onChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setMessage("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    
    // Validate form before submitting
    const validationErrors = validateAuth(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(signupUser(values)).unwrap();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrors(err?.errors || {});
      setMessage(err?.message || "Unable to create account.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Signup</h1>
        <p>Register with your email, phone number, or both. New accounts are assigned the User role.</p>
        <AuthForm
          mode="signup"
          values={values}
          errors={errors}
          loading={status === "loading"}
          message={message}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <p className="auth-switch">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default SignupPage;
