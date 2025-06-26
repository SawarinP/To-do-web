require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', require('./routes/UserRoute'));
app.use('/api/tasks', require('./routes/TaskRoute'));

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
