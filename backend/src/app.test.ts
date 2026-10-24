import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "./app";

test("GET /health returns 200", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
});

test("POST rejects a negative amount", async () => {
  const response = await request(app).post("/api/expenses").send({
    title: "Invalid expense",
    amount: -10,
    category: "Food",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});

test("POST rejects a missing title", async () => {
  const response = await request(app).post("/api/expenses").send({
    amount: 100,
    category: "Food",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});
