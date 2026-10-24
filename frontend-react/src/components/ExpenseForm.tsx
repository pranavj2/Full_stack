import type { ChangeEvent, FormEvent } from "react";
import type { ExpenseFormState } from "../types/expense";

interface ExpenseFormProps {
  form: ExpenseFormState;
  editingId: string | null;
  saving: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const ExpenseForm = ({
  form,
  editingId,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: ExpenseFormProps) => {
  return (
    <form className="expense-form" onSubmit={onSubmit}>
      <h2>{editingId ? "Update Expense" : "Add Expense"}</h2>

      <label htmlFor="title">Expense title</label>
      <input
        id="title"
        name="title"
        placeholder="e.g. Groceries"
        value={form.title}
        onChange={onChange}
        maxLength={150}
        required
      />

      <label htmlFor="amount">Amount (₹)</label>
      <input
        id="amount"
        name="amount"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="e.g. 850"
        value={form.amount}
        onChange={onChange}
        required
      />

      <label htmlFor="category">Category</label>
      <select
        id="category"
        name="category"
        value={form.category}
        onChange={onChange}
        required
      >
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : editingId ? "Update Expense" : "Add Expense"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
