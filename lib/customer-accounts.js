import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { open, readFile, rename, unlink, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const dataDirectory = path.join(process.cwd(), ".data");
const accountsFile = path.join(dataDirectory, "customer-accounts.json");
const accountsLock = path.join(dataDirectory, "customer-accounts.lock");
const KEY_LENGTH = 64;

export function normalizeCustomerEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

async function readAccounts() {
  try {
    const accounts = JSON.parse(await readFile(accountsFile, "utf8"));
    if (!Array.isArray(accounts)) throw new Error("The customer account store must contain a JSON array.");
    return accounts;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeAccounts(accounts) {
  const temporaryFile = path.join(dataDirectory, `${randomBytes(12).toString("hex")}.accounts.tmp`);
  try {
    await writeFile(temporaryFile, JSON.stringify(accounts), "utf8");
    await rename(temporaryFile, accountsFile);
  } finally {
    try { await unlink(temporaryFile); } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
}

async function withAccountLock(operation) {
  await mkdir(dataDirectory, { recursive: true });
  let lock;
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    try {
      lock = await open(accountsLock, "wx");
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (attempt === 999) throw new Error("Timed out waiting for the customer account store lock.");
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
  try {
    const accounts = await readAccounts();
    const result = await operation(accounts);
    await writeAccounts(accounts);
    return result;
  } finally {
    await lock.close();
    await unlink(accountsLock);
  }
}

async function makePasswordHash(password, salt) {
  return Buffer.from(await scrypt(password, salt, KEY_LENGTH)).toString("base64url");
}

export async function createCustomerAccount(email, password) {
  const salt = randomBytes(16).toString("base64url");
  const passwordHash = await makePasswordHash(password, salt);
  return withAccountLock((accounts) => {
    if (accounts.some((account) => account.email === email)) return false;
    accounts.push({ email, salt, passwordHash, createdAt: new Date().toISOString() });
    return true;
  });
}

export async function verifyCustomerPassword(email, password) {
  const accounts = await readAccounts();
  const account = accounts.find((entry) => entry.email === email);
  if (!account) {
    await makePasswordHash(password, "addis-eats-dummy-salt");
    return false;
  }
  const actual = Buffer.from(await makePasswordHash(password, account.salt));
  const expected = Buffer.from(account.passwordHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
