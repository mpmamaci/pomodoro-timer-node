const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const app = express();
const PomodoroTimer = require('./Pomodoro/PomodoroTimer');
const defaultTimer = new PomodoroTimer(0, 0);

const Timers = [new PomodoroTimer(0, 0), new PomodoroTimer(0, 0), new PomodoroTimer(0, 0)];

// Reads the .env-file
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.HOST
  })
);

console.log(process.env.HOST);

app.get('/api/timer/status', (req, res) => {
  res.send(defaultTimer.status());
});

app.get('/api/timer/stop', (req, res) => {
  defaultTimer.stop();
  res.send(defaultTimer.status());
});

app.post('/api/timer/focus/start', (req, res) => {
  const { error } = validateTimer(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let time = req.body.time;

  if (!defaultTimer.startFocustime(time)) {
    return res.status(409).send('Timer is running');
  }
  res.status(200).send(defaultTimer.status());
});

app.post('/api/timer/pause/start', (req, res) => {
  const { error } = validateTimer(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let time = req.body.time;

  if (!defaultTimer.startPausetime(time)) {
    return res.status(409).send('Timer is running');
  }
  res.status(200).send(defaultTimer.status());
});

app.get('/api/timer/:id', (req, res) => {
  const { error } = validateId(req.params);

  if (error) return res.status(400).send(error.details[0].message);

  res.send(Timers[req.params.id - 1].status());
});

app.listen(port, () => console.log(`listen on port ${process.env.PORT}..`));

function validateTimer(timer) {
  schema = {
    time: Joi.number()
      .min(0)
      .max(1440)
      .required()
  };

  return Joi.validate(timer, schema);
}

function validateId(id) {
  schema = {
    id: Joi.number()
      .min(1)
      .max(3)
      .required()
  };

  return Joi.validate(id, schema);
}
