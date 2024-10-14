const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("tiny"));

const PORT = process.env.PORT || 3001;
app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please choose a different port.`
      );
    } else {
      console.error("An error occurred while starting the server:", err);
    }
    process.exit(1);
  });

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people. <br><br>${Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).send(`Person with id: ${id} is not found`);
  }
  response.send(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  let deletedPerson = persons.filter((person) => person.id !== id);
  response.send(deletedPerson);
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  body.id = generatedId();
  if (!body.name || !body.number) {
    response.status(404).json({ error: "name or number is missing" });
  }

  const existingName = persons.find((person) => person.name === body.name);
  if (existingName) {
    response.status(400).json({ error: "name must be unique" });
  }
  persons = persons.concat(body);
  response.status(201).send(persons);
});

const generatedId = () => {
  const maxId =
    persons.length > 0 ? Math.floor(Math.random() * (200 - 5 + 1) + 5) : 0;
  return maxId + 1;
};

//middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
