import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
const navigate = useNavigate();
const { login } = useAuth();

const [form, setForm] = useState({
email: "",
password: ""
});

const handleSubmit = (e) => {
e.preventDefault();


if (form.email === "admin@gmail.com") {
  login({
    name: "Admin",
    role: "ADMIN",
    email: form.email
  });

  navigate("/admin");
} else {
  login({
    name: "User",
    role: "USER",
    email: form.email
  });

  navigate("/dashboard");
}

};

return ( <form onSubmit={handleSubmit}>
<input
placeholder="Email"
onChange={(e) =>
setForm({ ...form, email: e.target.value })
}
/>

  <input
    type="password"
    placeholder="Password"
    onChange={(e) =>
      setForm({ ...form, password: e.target.value })
    }
  />

  <button type="submit">Login</button>
</form>

);
}

export default Login;
