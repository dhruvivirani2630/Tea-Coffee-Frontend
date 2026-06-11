import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { Detail } from "../user/ProfilePage";
import { formatDate } from "../../utils/date";
import { clearSelectedUser, fetchUserById } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.selectedUser);
  const error = useAppSelector((state) => state.users.error);
  const loading = useAppSelector((state) => state.users.selectedStatus === "loading");

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, id]);

  if (error) return <div className="alert error">{error}</div>;
  if (loading || !user) return <Loader label="Loading user" />;

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>User Details</h1>
          <p>{user.fullName}</p>
        </div>
        <Link className="button primary" to={`/admin/users/${user.id}/edit`}>Edit user</Link>
      </div>
      <div className="panel detail-grid">
        <Detail label="Full Name" value={user.fullName} />
        <Detail label="Employee ID" value={user.employeeId} />
        <Detail label="Email" value={user.email} />
        <Detail label="Phone" value={user.phone} />
        <Detail label="Role" value={user.role} />
        <Detail label="Status" value={user.status} />
        <Detail label="Created Date" value={formatDate(user.createdDate)} />
        <Detail label="Updated Date" value={formatDate(user.updatedDate)} />
      </div>
    </section>
  );
};

export default UserDetails;
