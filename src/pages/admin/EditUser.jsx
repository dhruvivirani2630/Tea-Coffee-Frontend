import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ProfileForm from "../../components/forms/ProfileForm";
import { fetchUserById, updateUserById } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const loading = useAppSelector((state) => state.users.selectedStatus === "loading");
  const error = useAppSelector((state) => state.users.error);

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (error) return <div className="alert error">{error}</div>;
  if (loading || !selectedUser) return <Loader label="Loading user" />;

  return <EditUserForm key={selectedUser.id} id={id} initialValues={selectedUser} navigate={navigate} />;
};

const EditUserForm = ({ id, initialValues, navigate }) => {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const onChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateUserById({ id, updates: values })).unwrap();
      navigate(`/admin/users/${id}`);
    } catch (err) {
      setErrors(err?.errors || {});
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Edit User</h1>
          <p>Admin role remains locked for the seeded admin account.</p>
        </div>
      </div>
      <ProfileForm
        values={values}
        errors={errors}
        loading={false}
        adminMode
        lockRole
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default EditUser;
