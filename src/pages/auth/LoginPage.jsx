import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm";
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

  if (user) return <Navigate to={user.role === "Admin" ? "/admin" : "/dashboard"} replace />;

  const onChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setMessage("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setErrors(err?.errors || {});
      setMessage(err?.message || "Unable to login.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Login</h1>
        <p>Use admin@company.com / Admin@123 or user@company.com / User@1234.</p>
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
