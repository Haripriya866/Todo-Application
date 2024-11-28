const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());

app.options("*", cors()); // Enable CORS for all routes

const path = require("path");
app.use(express.json());

const dbPath = path.join(__dirname, "users.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3006, () => {
      console.log("server is running on http://localhost:3006");
    });
  } catch (e) {
    console.log(`db error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_KEY", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.name = payload.name;
        next();
      }
    });
  }
};

//registration api

app.post("/register", async (request, response) => {
  const { name, email, password } = request.body;

  // Validate the received data
  if (!name || !email || !password) {
    return response.status(400).json({ error: "All fields are required" });
  }

  const selectUserQuery = `SELECT * FROM userDetails WHERE name = ?`;
  const dbUser = await db.get(selectUserQuery, [name]);

  if (dbUser === undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuid.v4();

    const query = `INSERT INTO userDetails (id, name, email, password) VALUES (?, ?, ?, ?)`;
    await db.run(query, [userId, name, email, hashedPassword]);
    response.status(200).json({ message: "User created successfully" });
  } else {
    return response.status(400).json({ error: "User already exists" });
  }
});

//login api

app.post("/login/", async (request, response) => {
  const { name, password } = request.body;
  const selectUserQuery = `SELECT * FROM userDetails WHERE name = ?`;
  const dbUser = await db.get(selectUserQuery, [name]);

  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {
        name: name,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
      console.log(jwtToken);
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//update api
app.put("/change-password", authenticateToken, async (request, response) => {
  const requestBodyDetails = request.body;
  const { name, oldPassword, newPassword } = requestBodyDetails;

  const selectUserQuery = `SELECT * FROM userDetails WHERE name = ?`;
  const dbUser = await db.get(selectUserQuery, [name]);

  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      dbUser.password
    );
    if (isPasswordMatched === true) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateQuery = `
      UPDATE userDetails
      SET password = ?
      WHERE name = ?
    `;
      await db.run(updateQuery, [hashedPassword, name]);
      response.status(200);
      response.send("Password updated");
    } else {
      response.status(400);
      response.send("Invalid current password");
    }
  }
});

//get users api
app.get("/users/", authenticateToken, async (request, response) => {
  const name = request.name;
  console.log(name);
  const getStateQuery = `
    SELECT * FROM userDetails WHERE name='${name}'
    `;
  const usersArray = await db.all(getStateQuery);
  response.send(usersArray);
});

//todo CRUD Operations

//create todo api
app.post("/todos/", authenticateToken, async (request, response) => {
  const { todo, status } = request.body;
  const name = request.name;

  if (!todo || !status) {
    return response.status(400).send("Todo and status are required");
  }
  const userCheckQuery = `SELECT * FROM userDetails WHERE name = ?`;
  const user = await db.get(userCheckQuery, [name]);
  if (!user) {
    return response.status(400).send("User does not exist");
  }

  const id = uuid.v4();
  const addTodoQuery = `
    INSERT INTO todo (id, todo, status,user_name)
    VALUES ("${id}", "${todo}", "${status}","${name}")
  `;
  try {
    await db.run(addTodoQuery);
    response.status(201).send("Todo Successfully Added");
  } catch (error) {
    response.status(500).send("Error adding todo");
  }
});

//delete todo api
app.delete("/todos/:id/", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const name = request.name;
  const deleteTodoQuery = `
    DELETE FROM todo
    WHERE id='${id}' AND user_name='${name}'
    `;

  try {
    await db.run(deleteTodoQuery);
    response.send("Todo Successfully Deleted");
  } catch (error) {
    console.error("Error inserting todo:", error);
    response.status(500).send("Error deleting todo");
  }
});

//get todos array
app.get("/todos/", authenticateToken, async (request, response) => {
  const { status } = request.query;
  const name = request.name;

  const getTodosData = `
       SELECT * FROM todo
       WHERE status='${status}' AND user_name='${name}'
       `;
  try {
    const todoArray = await db.all(getTodosData);
    response.send(todoArray);
  } catch (error) {
    console.error("Error inserting todo:", error);
    response.status(500).send("Error getting todos");
  }
});

//get todo
app.get("/todos/:id/", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const name = request.name;
  const getTodoQuery = `
    
    SELECT * FROM todo
    WHERE id='${id}' AND user_name='${name}'`;

  try {
    const dbResponse = await db.get(getTodoQuery);
    response.send(dbResponse);
  } catch (error) {
    console.error("Error inserting todo:", error);
    response.status(500).send("Error getting todo");
  }
});

//update todo
app.put("/todos/:id/", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;
  const name = request.name;

  if (!status) {
    return response.status(400).send("status are required");
  }

  const updateTodoQuery = `
    UPDATE todo
    SET 
    status='${status}'
  WHERE id='${id}' AND user_name='${name}'
    `;
  try {
    await db.run(updateTodoQuery);
    response.send(`Status Updated`);
  } catch (error) {
    console.error("Error inserting todo:", error);
    response.status(500).send("Error adding todo");
  }
});
