const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('./redisHandler');

// import functions
const treeGet = require('../objects/tree/get');
const treeList = require('../objects/tree/list');
const treePut = require('../objects/tree/put');
const treeDel = require('../objects/tree/del');

// create the app
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors());

// create the redis client
const redisUrl = process.env.REDIS_URL || 'redis://localhost';
const redis = new Redis(process.env.REDIS_URL);

// routes
app.get('/tree/:id', async (req, res) => {
  await treeGet(req, res, redis);
});

app.get('/tree', async (req, res)  => {
  await treeList(req, res, redis);
});

app.put('/tree/:id', async (req, res) => {
  await treePut(req, res, redis);
});

app.delete('/tree/:id', async (req, res) => {
  await treeDel(req, res, redis);
});

module.exports = app;
