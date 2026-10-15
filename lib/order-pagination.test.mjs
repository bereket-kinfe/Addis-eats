import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { getPaginationModel } from "./order-pagination.mjs";
import { getSafeReturnPath } from "./redirects.js";
import { isAdminEmail, isAdminSession } from "./admin-auth.js";

test("only allowlisted email identities receive admin access", () => {
  const allowlist = " owner@example.com, STAFF@example.com ";
  assert.equal(isAdminEmail("OWNER@example.com", allowlist), true);
  assert.equal(isAdminEmail("customer@example.com", allowlist), false);
  assert.equal(isAdminEmail("owner@example.com.evil", allowlist), false);
  assert.equal(isAdminEmail(null, allowlist), false);
  assert.equal(isAdminSession({ role: "admin", email: "owner@example.com" }), false);
  assert.equal(isAdminSession({ role: "customer", email: "owner@example.com" }), false);
});

test("pagination exposes the single, first, middle, and last states", () => {
  assert.deepEqual(getPaginationModel(1, 1), {
    page: 1, totalPages: 1, previousPage: null, nextPage: null, state: "single",
  });
  assert.deepEqual(getPaginationModel(1, 4), {
    page: 1, totalPages: 4, previousPage: null, nextPage: 2, state: "first",
  });
  assert.deepEqual(getPaginationModel(2, 4), {
    page: 2, totalPages: 4, previousPage: 1, nextPage: 3, state: "middle",
  });
  assert.deepEqual(getPaginationModel(4, 4), {
    page: 4, totalPages: 4, previousPage: 3, nextPage: null, state: "last",
  });
});

test("crafted external next values cannot redirect away from the site", () => {
  assert.equal(getSafeReturnPath("https://attacker.example/steal"), "/cart");
  assert.equal(getSafeReturnPath("//attacker.example/steal"), "/cart");
  assert.equal(getSafeReturnPath("/\\attacker.example"), "/cart");
  assert.equal(getSafeReturnPath("/admin"), "/admin");
  assert.equal(getSafeReturnPath("/orders/123e4567-e89b-42d3-a456-426614174000"), "/orders/123e4567-e89b-42d3-a456-426614174000");
});

test("concurrent duplicate submissions create one order for an idempotency key", async () => {
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "addis-eats-orders-"));
  const originalDirectory = process.cwd();

  try {
    process.chdir(temporaryDirectory);
    const { createOrderForSession, getOrderForSession, getOrdersForSession } = await import("./db.js");
    const sessionId = "double-submit-test-session";
    const key = "123e4567-e89b-42d3-a456-426614174000";
    const items = [{ id: 1, name: "Doro Wat", price: 18, quantity: 1 }];
    const deliveryDetails = { name: "Test Customer", phone: "+251 911 234 567", address: "Bole, near the main road", area: "Bole" };
    const orders = await Promise.all([
      createOrderForSession(sessionId, items, key, deliveryDetails),
      createOrderForSession(sessionId, items, key, deliveryDetails),
    ]);

    assert.equal(orders[0].id, orders[1].id);
    assert.deepEqual(orders[0].deliveryDetails, deliveryDetails);
    assert.equal((await getOrdersForSession(sessionId)).length, 1);
    assert.equal(await getOrderForSession(orders[0].id, "another-account"), null);

    const anotherAccountOrder = await createOrderForSession(
      "another-account",
      items,
      "223e4567-e89b-42d3-a456-426614174000",
      deliveryDetails,
    );
    assert.equal(await getOrderForSession(anotherAccountOrder.id, sessionId), null);
  } finally {
    process.chdir(originalDirectory);
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});
