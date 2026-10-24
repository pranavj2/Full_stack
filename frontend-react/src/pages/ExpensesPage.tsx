import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExpenses } from "../api/expenseApi";
import type { Expense } from "../types/expense";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadExpenses = async (): Promise<void> => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch {
        setError("Unable to load expenses.");
      } finally {
        setLoading(false);
      }
    };

    void loadExpenses();
  }, []);

  return (
    <main className="container">
      <h1 className="highlight-heading">All Expenses</h1>

      <Link to="/" className="nav-button">
        ← Back to Home
      </Link>

      {loading && <p>Loading expenses...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <p>No expenses found. Add an expense from the home page.</p>
      )}

      {!loading && !error && expenses.length > 0 && (
        <ul className="page-expense-list">
          {expenses.map((expense) => (
            <li key={expense._id} className="page-expense-item">
              <div>
                <strong>{expense.title}</strong>
                <p>{expense.category}</p>
              </div>

              <strong>₹{expense.amount.toLocaleString("en-IN")}</strong>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ExpensesPage;
