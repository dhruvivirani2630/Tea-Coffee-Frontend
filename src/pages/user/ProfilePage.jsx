import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { useAppSelector } from "../../store/hooks";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Profile</h1>
          <p>Your account details and access information.</p>
        </div>
        <Link className="button primary" to="/profile/edit">Edit profile</Link>
      </div>
      <div className="panel detail-grid">
        <Detail label="Full Name" value={user.fullName} />
        <Detail label="Employee ID" value={user.employeeId} />
        <Detail label="Email" value={user.email} />
        <Detail label="Phone Number" value={user.phone} />
        <Detail label="Role" value={user.role} />
        <Detail label="Status" value={user.status} />
        <Detail label="Created Date" value={formatDate(user.createdDate)} />
        <Detail label="Updated Date" value={formatDate(user.updatedDate)} />
      </div>
    </section>
  );
};

export const Detail = ({ label, value }) => (
  <div className="detail-item">
    <span>{label}</span>
    <strong>{value || "-"}</strong>
  </div>
);

export default ProfilePage;
