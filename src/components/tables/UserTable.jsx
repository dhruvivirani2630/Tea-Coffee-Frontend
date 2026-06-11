import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";

const UserTable = ({ users, onToggleStatus, onDelete }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.employeeId}</td>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.role}</td>
            <td>
              <span className={`status ${user.status.toLowerCase()}`}>{user.status}</span>
            </td>
            <td>{formatDate(user.createdDate)}</td>
            <td>
              <div className="row-actions">
                <Link to={`/admin/users/${user.id}`}>View</Link>
                <Link to={`/admin/users/${user.id}/edit`}>Edit</Link>
                <button type="button" onClick={() => onToggleStatus(user)}>
                  {user.status === "Active" ? "Deactivate" : "Activate"}
                </button>
                <button type="button" className="danger-link" onClick={() => onDelete(user)}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
        {!users.length && (
          <tr>
            <td colSpan="8" className="empty">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default UserTable;
