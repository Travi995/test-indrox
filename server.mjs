import { SignJWT, jwtVerify } from "jose";
import { App } from "@tinyhttp/app";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createApp } from "json-server/lib/app.js";
import { json } from "milliparsec";

const adapter = new JSONFile("db.json");
const db = new Low(adapter, { users: [], tickets: [] });
await db.read();
db.data ||= { users: [], tickets: [] };
const jsonServerApp = createApp(db, { logger: false });
const app = new App();
const ALLOWED_ORIGIN = "http://localhost:5173";

const SECRET = new TextEncoder().encode("indrox-demo-secret");

const createToken = async (user) => {
  return new SignJWT({ sub: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET);
};

const readToken = (authorization) => {
  if (!authorization) return null;
  const [type, value] = authorization.split(" ");
  if (type !== "Bearer" || !value) return null;
  return value;
};

const ensureAuth = async (req, res, next) => {
  const token = readToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }

  try {
    await jwtVerify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token invalido o expirado" });
  }
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, If-Unmodified-Since");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  next();
});

app.post("/auth/login", json(), async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = db.data.users.find((item) => item.email === email && item.password === password);

  if (!user) {
    res.status(401).json({ message: "Credenciales invalidas" });
    return;
  }

  const accessToken = await createToken(user);
  const safeUser = { id: user.id, name: user.name, email: user.email };

  res.json({ accessToken, user: safeUser });
});

app.use("/tickets", ensureAuth);
app.get("/tickets", (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
  const status = typeof req.query.status === "string" ? req.query.status : "";
  const priority = typeof req.query.priority === "string" ? req.query.priority : "";
  const sortField = typeof req.query._sort === "string" ? req.query._sort : "updatedAt";
  const sortOrder = typeof req.query._order === "string" ? req.query._order : "desc";
  const page = Number(req.query._page ?? req.query.page ?? 1);
  const pageSize = Number(req.query._per_page ?? req.query.pageSize ?? req.query._limit ?? 10);

  let filtered = [...db.data.tickets];

  if (query) {
    filtered = filtered.filter((ticket) => {
      const haystack = `${ticket.title} ${ticket.code} ${ticket.requester?.email ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  if (status) {
    filtered = filtered.filter((ticket) => ticket.status === status);
  }

  if (priority) {
    filtered = filtered.filter((ticket) => ticket.priority === priority);
  }

  filtered.sort((a, b) => {
    const aValue = String(a[sortField] ?? "");
    const bValue = String(b[sortField] ?? "");
    const comparison = aValue.localeCompare(bValue);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  const totalItems = filtered.length;
  const totalPages = totalItems ? Math.ceil(totalItems / safePageSize) : 1;
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const data = filtered.slice(start, end);

  const payload = {
    first: 1,
    prev: safePage > 1 ? safePage - 1 : null,
    next: safePage < totalPages ? safePage + 1 : null,
    last: totalPages,
    pages: totalPages,
    items: totalItems,
    data,
  };

  res.json(payload);
});

app.put("/tickets/:id", json(), async (req, res) => {
  const { id } = req.params;
  const expectedUpdatedAt =
    req.headers["if-unmodified-since"] ?? req.body?.expectedUpdatedAt ?? req.body?.updatedAt ?? null;
  const index = db.data.tickets.findIndex((ticket) => String(ticket.id) === String(id));

  if (index === -1) {
    res.status(404).json({ message: "Ticket no encontrado" });
    return;
  }

  const currentTicket = db.data.tickets[index];
  if (expectedUpdatedAt && currentTicket.updatedAt !== expectedUpdatedAt) {
    res.status(409).json({
      code: "TICKET_CONFLICT",
      message: "El ticket fue modificado por otro usuario. Recarga e intenta nuevamente.",
      currentTicket,
    });
    return;
  }

  const payload = { ...req.body };
  delete payload.id;
  delete payload.code;
  delete payload.createdAt;
  delete payload.expectedUpdatedAt;

  const updatedTicket = {
    ...currentTicket,
    ...payload,
    id: currentTicket.id,
    code: currentTicket.code,
    createdAt: currentTicket.createdAt,
    updatedAt: new Date().toISOString(),
  };

  db.data.tickets[index] = updatedTicket;
  await db.write();
  res.json(updatedTicket);
});

app.patch("/tickets/:id/status", json(), async (req, res) => {
  const { id } = req.params;
  const index = db.data.tickets.findIndex((ticket) => String(ticket.id) === String(id));
  if (index === -1) {
    res.status(404).json({ message: "Ticket no encontrado" });
    return;
  }

  const status = req.body?.status;
  const validStatuses = new Set(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
  if (!validStatuses.has(status)) {
    res.status(400).json({ message: "Estado invalido" });
    return;
  }

  const currentTicket = db.data.tickets[index];
  const updatedTicket = {
    ...currentTicket,
    status,
    updatedAt: new Date().toISOString(),
  };

  db.data.tickets[index] = updatedTicket;
  await db.write();
  res.json(updatedTicket);
});
app.use(jsonServerApp);

app.listen(3001, () => {
  console.log("Mock API corriendo en http://localhost:3001");
});
