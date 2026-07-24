import { useState, useEffect } from "react";

const emptyForm = {
  employeeId: "",
  employeeName: "",
  drinkType: "Tea",
  quantity: 1,
  dateTime: "",
};

// Get current date-time in datetime-local format (YYYY-MM-DDTHH:mm)
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const AddEditOrderModal = ({ isOpen, onClose, onSubmit, editingOrder = null, user = null, isAdmin = false }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingOrder) {
      setForm({
        employeeId: editingOrder.employeeId || "",
        employeeName: editingOrder.employeeName || "",
        drinkType: editingOrder.drinkType || "Tea",
        quantity: editingOrder.quantity || 1,
        dateTime: editingOrder.dateTime || "",
      });
    } else {
      // Auto-fill employee details and current datetime when adding new order
      setForm({
        employeeId: user?.employeeId || "",
        employeeName: user?.fullName || "",
        drinkType: "Tea",
        quantity: 1,
        dateTime: getCurrentDateTime(),
      });
    }
  }, [editingOrder, isOpen, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.drinkType || !form.quantity) return;

    const payload = {
      drinkType: form.drinkType,
      quantity: Number(form.quantity),
      dateTime: form.dateTime ? new Date(form.dateTime).toISOString() : new Date().toISOString(),
      userId: user?.id || "",
      role: user?.role || "",
      employeeId: user?.employeeId || "",
      employeeName: user?.fullName || "",
    };

    onSubmit(payload);
    handleClose();
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingOrder ? "Edit Order" : "Add New Order"}</h2>
          <button type="button" className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {!isAdmin && (
            <>
              <div className="form-group">
                <label htmlFor="employee-id">Employee ID</label>
                <input
                  id="employee-id"
                  type="text"
                  value={form.employeeId}
                  onChange={(event) => setForm((current) => ({ ...current, employeeId: event.target.value }))}
                  placeholder="Employee ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="employee-name">Employee Name</label>
                <input
                  id="employee-name"
                  type="text"
                  value={form.employeeName}
                  onChange={(event) => setForm((current) => ({ ...current, employeeName: event.target.value }))}
                  placeholder="Employee Name"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="drink-type">Drink Type</label>
            <select
              id="drink-type"
              value={form.drinkType}
              onChange={(event) => setForm((current) => ({ ...current, drinkType: event.target.value }))}
            >
              <option value="Tea">Tea</option>
              <option value="Coffee">Coffee</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity (cups)</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) => setForm((current) => ({ ...current, quantity: Number(event.target.value) }))}
              placeholder="Quantity of cups"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date-time">Date Time</label>
            <input
              id="date-time"
              type="datetime-local"
              value={form.dateTime}
              onChange={(event) => setForm((current) => ({ ...current, dateTime: event.target.value }))}
              placeholder="Date Time"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingOrder ? "Update Order" : "Add Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditOrderModal;
