import type { Expense } from "../types/expense";
import ExpenseItem from "./ExpenseItem";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseList = ({
  expenses,
  loading,
  onEdit,
  onDelete,
}: ExpenseListProps) => {
  return (
    <section className="expense-list">
      <h2>Recent Expenses ({expenses.length})</h2>

      {loading ? (
        <p>Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses yet. Add your first expense above.</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </section>
  );
};

export default ExpenseList;
