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

app.use(json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  next();
});

app.post("/auth/login", async (req, res) => {
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
app.use(jsonServerApp);

app.listen(3001, () => {
  console.log("Mock API corriendo en http://localhost:3001");
});
