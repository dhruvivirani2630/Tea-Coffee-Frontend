import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm";
import { ROLES } from "../../constants/roles";
import { loginUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { validateLogin } from "../../utils/validators";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  if (user) {
    return <Navigate to={user.role === ROLES.ADMIN ? "/admin" : "/dashboard"} replace />;
  }

  const onChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setMessage("");
  };

  const extractErrorMessage = (error) => {
    // Prefer the API's message over Axios's generic "Request failed" message.
    if (typeof error === "string") return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.message) return error.message;
    return "Unable to login. Please try again.";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    
    // Validate form before submitting
    const validationErrors = validateLogin(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await dispatch(loginUser(values)).unwrap();
      const fallback = result.user.role === ROLES.ADMIN ? "/admin" : "/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const fieldErrors = err?.response?.data?.errors;

      if (fieldErrors && typeof fieldErrors === "object") {
        setErrors(fieldErrors);
      } else if (/invalid password/i.test(errorMessage)) {
        setErrors({ password: "Invalid password" });
      } else {
        setMessage(errorMessage);
      }
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Login</h1>
        <p>Sign in with your email or phone number and password.</p>
        <AuthForm
          mode="login"
          values={values}
          errors={errors}
          loading={status === "loading"}
          message={message}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
