import { useEffect, useMemo, useState } from "react";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import UserTable from "../../components/tables/UserTable";
import { ROLES, STATUS } from "../../constants/roles";
import { deleteUserById, fetchUsers, setUserStatusById } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const pageSize = 6;

const UserManagement = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({ search, role, status }));
  }, [dispatch, search, role, status]);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleRoleChange = (value) => {
    setPage(1);
    setRole(value);
  };

  const handleStatusChange = (value) => {
    setPage(1);
    setStatus(value);
  };

  const pageCount = Math.max(1, Math.ceil(users.length / pageSize));
  const visibleUsers = useMemo(() => users.slice((page - 1) * pageSize, page * pageSize), [users, page]);

  const toggleStatus = async (user) => {
    const nextStatus = user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
    try {
      await dispatch(setUserStatusById({ id: user.id, status: nextStatus })).unwrap();
      setMessage(`${user.fullName} marked ${nextStatus}.`);
      dispatch(fetchUsers({ search, role, status }));
    } catch (error) {
      setMessage(error?.message || "Unable to update user status.");
    }
  };

  const deleteUser = async () => {
    try {
      await dispatch(deleteUserById(pendingDelete.id)).unwrap();
      setMessage(`${pendingDelete.fullName} deleted.`);
      setPendingDelete(null);
      dispatch(fetchUsers({ search, role, status }));
    } catch (error) {
      setMessage(error?.message || "Unable to delete user.");
      setPendingDelete(null);
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>User Management</h1>
          <p>Search, filter, view, edit, activate, deactivate, and delete users.</p>
        </div>
      </div>
      {message && <div className="alert success">{message}</div>}
      <div className="toolbar">
        <SearchBar value={search} onChange={handleSearchChange} placeholder="Search name, ID, email, phone" />
        <select value={role} onChange={(event) => handleRoleChange(event.target.value)}>
          <option>All</option>
          <option>{ROLES.ADMIN}</option>
          <option>{ROLES.USER}</option>
        </select>
        <select value={status} onChange={(event) => handleStatusChange(event.target.value)}>
          <option>All</option>
          <option>{STATUS.ACTIVE}</option>
          <option>{STATUS.INACTIVE}</option>
        </select>
      </div>
      <UserTable users={visibleUsers} onToggleStatus={toggleStatus} onDelete={setPendingDelete} />
      <Pagination page={page} pageCount={pageCount} onPageChange={(next) => setPage(Math.min(pageCount, Math.max(1, next)))} />
      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete User"
        message={`Delete ${pendingDelete?.fullName}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={deleteUser}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
};

export default UserManagement;
