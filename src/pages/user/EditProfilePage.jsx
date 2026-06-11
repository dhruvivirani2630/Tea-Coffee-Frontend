import { useState } from "react";
import Loader from "../../components/common/Loader";
import ProfileForm from "../../components/forms/ProfileForm";
import { updateCurrentUserProfile } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const EditProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.status === "loading");
  if (!user) return <Loader label="Loading profile" />;

  return <EditProfileForm key={user.id} initialValues={user} loading={loading} />;
};

const EditProfileForm = ({ initialValues, loading }) => {
  const dispatch = useAppDispatch();
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
      await dispatch(updateCurrentUserProfile(values)).unwrap();
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setErrors(err?.errors || {});
      setMessage(err?.message || "Unable to update profile.");
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Edit Profile</h1>
          <p>Role changes are restricted to seed data and admin configuration.</p>
        </div>
      </div>
      {message && <div className="alert error">{message}</div>}
      <ProfileForm values={values} errors={errors} loading={loading} success={success} onChange={onChange} onSubmit={onSubmit} />
    </section>
  );
};

export default EditProfilePage;
