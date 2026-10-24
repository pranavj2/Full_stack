import { memo } from "react";
import type { Expense } from "../types/expense";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseItem = ({ expense, onEdit, onDelete }: ExpenseItemProps) => {
  return (
    <article className="expense-item">
      <div>
        <strong>{expense.title}</strong>
        <p>{expense.category}</p>
      </div>

      <div className="expense-actions">
        <strong>₹{expense.amount.toLocaleString("en-IN")}</strong>
        <button
          type="button"
          className="secondary"
          onClick={() => onEdit(expense)}
        >
          Edit
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => onDelete(expense._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default memo(ExpenseItem);
