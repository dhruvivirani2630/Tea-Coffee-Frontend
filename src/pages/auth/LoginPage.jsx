import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm";
import { ROLES } from "../../constants/roles";
import { loginUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

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

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      const fallback = result.user.role === ROLES.ADMIN ? "/admin" : "/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setErrors(err?.errors || {});
      setMessage(err?.message || "Unable to login.");
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
