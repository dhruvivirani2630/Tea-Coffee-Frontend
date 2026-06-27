import { useEffect, useState } from "react";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import UserTable from "../../components/tables/UserTable";
import { ROLES, STATUS } from "../../constants/roles";
import { deleteUserById, fetchUsers, setUserStatusById } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const pageSize = 10;

const UserManagement = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const loading = useAppSelector((state) => state.users.status === "loading");
  const error = useAppSelector((state) => state.users.error);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [user.fullName, user.employeeId, user.email, user.phone].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term),
      );
    const matchesRole = role === "All" || user.role === role;
    const matchesStatus = status === "All" || user.status === status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const toggleStatus = async (user) => {
    const nextStatus = user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
    try {
      await dispatch(setUserStatusById({ id: user.id, status: nextStatus })).unwrap();
      setMessage(`${user.fullName} marked ${nextStatus}.`);
    } catch (toggleError) {
      setMessage(toggleError?.message || "Unable to update user status.");
    }
  };

  const deleteUser = async () => {
    try {
      await dispatch(deleteUserById(pendingDelete.id)).unwrap();
      setMessage(`${pendingDelete.fullName} deleted.`);
      setPendingDelete(null);
    } catch (deleteError) {
      setMessage(deleteError?.message || "Unable to delete user.");
      setPendingDelete(null);
    }
  };

  if (loading && !users.length) return <Loader label="Loading users" />;

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>User Management</h1>
          <p>Search, filter, view, edit, activate, deactivate, and delete users.</p>
        </div>
      </div>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="toolbar">
        <SearchBar value={search} onChange={handleSearchChange} placeholder="Search name, ID, email, phone" />
        <select value={role} onChange={(event) => handleRoleChange(event.target.value)}>
          <option value="All">All</option>
          <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
          <option value={ROLES.USER}>{ROLES.USER}</option>
        </select>
        <select value={status} onChange={(event) => handleStatusChange(event.target.value)}>
          <option value="All">All</option>
          <option value={STATUS.ACTIVE}>{STATUS.ACTIVE}</option>
          <option value={STATUS.INACTIVE}>{STATUS.INACTIVE}</option>
        </select>
      </div>
      <UserTable users={visibleUsers} onToggleStatus={toggleStatus} onDelete={setPendingDelete} />
      <Pagination
        page={currentPage}
        pageCount={totalPages}
        onPageChange={(next) => setPage(Math.min(totalPages, Math.max(1, next)))}
      />
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
