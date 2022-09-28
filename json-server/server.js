const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const cors = require("cors");


const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());

const SECRET_KEY = "123456789";
const expiresIn = "1h";

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

function getRequesToken(request) {
  return request.headers.authorization.split(" ")[1];
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
  return (
    userdb.users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
}

function getUserByEmail(email) {
  const user = userdb.users.find((user) => user.email === email);
  return user;
}

function isAdminUser(req) {
  const token = getRequesToken(req);
  const { role } = verifyToken(token);
  return role === "Admin";
}

server.use(/^(?!\/auth\/login).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Bad authorization header";
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (err) {
    const status = 401;
    const message = "Error: access_token is not valid";
    res.status(status).json({ status, message });
  }
});

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (isAuthenticated({ email, password }) === false) {
    const status = 400;
    const message = "Incorrect email or password";
    res.status(status).json({ status, message });
    return;
  }
  const { id, name, role } = getUserByEmail(email);
  const token = createToken({ id, name, email, role });
  res.status(200).json({
    token,
  });
});

server.post("/auth/register", (req, res) => {
  if (!isAdminUser(req)) {
    const status = 403;
    const message = "Only users with admin privileges can edit this user";
    res.status(status).json({ status, message });
    return;
  }

  const existingUser = getUserByEmail(req.body.email);
  if (existingUser) {
    const status = 400;
    const message = "There is already a user with that email";
    res.status(status).json({ status, message });
    return;
  }

  const users = userdb.users;
  req.body.id = users.length + 1;
  users.push(req.body);
  fs.writeFileSync("./users.json", JSON.stringify(userdb));
  ({ id, name, email, role } = users[users.length - 1]);
  const token = createToken({ id, name, email, role });
  res.status(200).json({ token });

});

server.put("/auth/roles/:id", (req, res) => {
  const { id } = req.params;
  const { isAdmin: is_admin } = req.body;
  const users = userdb.users;
  const user = users.find((u) => u.id === Number(id));
  if (!isAdminUser(req)) {
    const status = 403;
    const message = "Only users with admin privileges can edit this user";
    res.status(status).json({ status, message });
    return;
  }

  if (!user) {
    const status = 404;
    const message = $`User with id ${id} was not found`;
    res.status(status).json({ status, message });
    return;
  }
  user.role = is_admin ? "Admin" : "User";
  fs.writeFileSync("./users.json", JSON.stringify(userdb));
  const status = 204;
  res.status(status).json();
});

server.put("/auth/state/:id", (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;

  const users = userdb.users;
  const user = users.find((u) => u.id === Number(id));
  if (!isAdminUser(req)) {
    const status = 403;
    const message = "Only users with admin privileges can edit this user";
    res.status(status).json({ status, message });
    return;
  }

  if (!user) {
    const status = 404;
    const message = $`User with id ${id} was not found`;
    res.status(status).json({ status, message });
    return;
  }

  user.enabled = enabled;
  fs.writeFileSync("./users.json", JSON.stringify(userdb));
  const status = 204;
  res.status(status);

});

server.use("/api", router);

server.listen(3000, () => {
  console.log("Run Auth API Server");
});
