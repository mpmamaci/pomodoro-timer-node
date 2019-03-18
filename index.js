const Joi = require('joi');
const express = require('express');
const app = express();
const PomodoroTimer = require('./Pomodoro/PomodoroTimer');
const Timer = new PomodoroTimer(25, 5);

const DEFAULT_TIME = 25;
const DEFAULT_PAUSE_TIME = 5;
app.use(express.json());

// Reads the .env-file
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

app.get('/api/timer/status', (req, res) => {
  res.send(Timer.status());
});

app.get('/api/timer/stop', (req, res) => {
  res.send(Timer.stop());
});

app.get('/api/timer/start/focus', (req, res) => {
  const { error } = validateTimer(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let time = req.body.time;

  time ? (time = time) : (time = DEFAULT_TIME);

  Timer.startFocustime(time);
  res.status(200).send(Timer.status());
});

app.get('/api/timer/start/pause', (req, res) => {
  const { error } = validateTimer(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let time = req.body.time;

  time ? (time = time) : (time = DEFAULT_PAUSE_TIME);

  Timer.startPausetime(time);
  res.status(200).send(Timer.status());
});

app.listen(port, () => console.log(`listen on port ${process.env.PORT}..`));

function validateTimer(course) {
  schema = {
    time: Joi.number()
      .min(1)
      .required()
  };

  return Joi.validate(course, schema);
}
