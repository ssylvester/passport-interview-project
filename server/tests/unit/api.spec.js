const request = require('supertest');
const { expect } = require('chai')
const rewire = require('rewire');
const sinon = require('sinon');
const mockRedis = require('redis-mock');
const RedisHandler = require('../../lib/redisHandler');

// rewire the app
const app = rewire('../../lib/expressHandler');

// create function stubs
const listStub = sinon.stub();
const getStub = sinon.stub();
const putStub = sinon.stub();

// patch in the new definition
app.__set__('redis', new RedisHandler('redis://localhost', mockRedis));

describe('app tests', () => {
  it('should respond with the correct data results', (done) => {
    // set tree contents to be used later
    const treeContents = { id: 'john', factories: {}};

    // put something into the db
    request(app)
      .put(`/tree/${treeContents.id}`)
      .send(treeContents)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      });

    // now get the tree
    request(app)
      .get(`/tree/${treeContents.id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        // make sure the tree contents match
        expect(res.body).to.eql(treeContents);
      });

    // get the list of keys
    request(app)
      .get('/tree')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        // make sure that the list contains the rigt values
        expect(res.body).to.eql([treeContents.id]);
        done();
      });
  });

  it('bad put', (done) => {
    // set tree contents to be used later
    const treeContents = { name: 'john' };

    // put something into the db
    request(app)
      .put(`/tree/${treeContents.id}`)
      .send(treeContents)
      .expect(500)
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  it('invalid id', (done) => {
    // set tree contents to be used later
    const treeContents = { id: 'john', factories: {}};

    // put something into the db with a bad id
    request(app)
      .put('/tree/id116;')
      .send(treeContents)
      .expect(500)
      .end(function (err, res) {
        if (err) throw err;
        
      });

    // put something with mismatched id
    request(app)
      .put('/tree/id116')
      .send(treeContents)
      .expect(500)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.text).to.eq('request and payload ids must match');
        done();
      });
  });
});