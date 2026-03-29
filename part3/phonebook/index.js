require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  }),
);

app.get("/info", (request, response) => {
  Person.countDocuments().then((count) => {
    response.send(`
        <div>phonebook has info for ${count} people</div>
        <br/>
        <div>${new Date()}</div>
      `);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch(() => response.status(404).end());
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).exec();
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name and number are required" });
  }

  Person.findOne({ name: body.name }).then((person) => {
    if (person) {
      return response.status(400).json({ error: "name must be unique" });
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      });
      person.save().then((result) => response.json(result));
    }
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
