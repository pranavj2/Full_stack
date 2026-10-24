import { useEffect, useState, useMemo, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./api/expenseApi";

import type { Expense, ExpenseFormState } from "./types/expense";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

const initialForm: ExpenseFormState = {
  title: "",
  amount: "",
  category: "Food",
};
import "./App.css";
function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<ExpenseFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadExpenses = async (): Promise<void> => {
    try {
      setError("");
      const data = await getExpenses();
      setExpenses(data);
    } catch {
      setError("Unable to load expenses. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExpenses();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (
      !form.title.trim() ||
      !form.amount.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !form.category.trim()
    ) {
      setError("Enter a title, valid amount, and category.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        amount,
        category: form.category,
      };

      if (editingId !== null) {
        await updateExpense(editingId, payload);
      } else {
        await createExpense(payload);
      }

      setForm({ ...initialForm });
      setEditingId(null);

      await loadExpenses();
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Unable to save expense.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = useCallback((expense: Expense): void => {
    setForm({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
    });

    setEditingId(expense._id);
    setError("");
  }, []);

  const handleCancel = (): void => {
    setForm({ ...initialForm });
    setEditingId(null);
    setError("");
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      setError("");
      await deleteExpense(id);
      await loadExpenses();
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Unable to delete expense.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  function handleLogout(): void {
    logout();
    navigate("/login", { replace: true });
  }
  const total = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  return (
    <main className="home-container">
      <header className="header">
        <div>
          <h1 className="highlight-heading">Expense Tracker</h1>
          <div className="home-actions">
            {isAuthenticated ? (
              <>
                <p>You are logged in.</p>
                <Link to="/expenses" className="nav-button">
                  View Expenses
                </Link>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                {" | "}
                <Link to="/register">Create Account</Link>
              </>
            )}
          </div>
          <p>Manage your daily expenses</p>
        </div>

        <div className="total">
          <span>Total expenses</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </div>
      </header>

      <ExpenseForm
        form={form}
        editingId={editingId}
        saving={saving}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <ExpenseList
        expenses={expenses}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
}

export default App;
