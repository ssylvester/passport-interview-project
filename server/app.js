const app = require('./lib/expressHandler');

// start listening
app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}!`),
);
