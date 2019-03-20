const Joi = require('joi');
const express = require('express');
const app = express();
const PomodoroTimer = require('./Pomodoro/PomodoroTimer');
const Timer = new PomodoroTimer(0, 0);

app.use(express.json());

// Reads the .env-file
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

app.get('/api/timer/status', (req, res) => {
  res.send(Timer.status());
});

app.get('/api/timer/stop', (req, res) => {
  Timer.stop();
  res.send(Timer.status());
});

app.post('/api/timer/focus/start', (req, res) => {
  const { error } = validateTimer(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let time = req.body.time;

  if (!Timer.startFocustime(time)) {
    return res.status(409).send('Timer is running');
  }
  res.status(200).send(Timer.status());
});

app.post('/api/timer/pause/start', (req, res) => {
  const { error } = validateTimer(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let time = req.body.time;

  if (!Timer.startPausetime(time)) {
    return res.status(409).send('Timer is running');
  }
  res.status(200).send(Timer.status());
});

app.listen(port, () => console.log(`listen on port ${process.env.PORT}..`));

function validateTimer(course) {
  schema = {
    time: Joi.number()
      .min(1)
      .max(1440)
      .required()
  };

  return Joi.validate(course, schema);
}
