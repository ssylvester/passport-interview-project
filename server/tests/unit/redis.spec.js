const rewire = require('rewire');
const RedisHandler = rewire('../../lib/redisHandler');
const redisMock = require('redis-mock');
const sinon = require('sinon');
const { expect } = require('chai');

let redis;
const hostUrl = 'redis://localhost';

describe('redishandler tests', () => {
  beforeEach(() => {
    // swap redis for redis-mock
    RedisHandler.__set__('redis', redisMock);
    redis = new RedisHandler(hostUrl);
  });

  it('should create and return a client', () => {
    // make sure the host is stored
    expect(redis.url).to.eq(hostUrl)

    // spy on createClient
    const spy = sinon.spy(redisMock, 'createClient');

    // get a client
    const client = redis.getClient();

    // make sure the callcount is 1
    expect(spy.callCount).to.eq(1);
    expect(spy.calledWith(hostUrl)).to.be.true;

    // create a function that show throw an exception
    function badFunc() {
      client.emit('error', 'error message');
    }

    expect(badFunc).to.throw('error message');
  });

  it('should put and get successfully', async () => {
    const key = 'key';
    const value = 'value';

    // put something
    await redis.put(key, value);

    // now get it back
    const newValue = await redis.get(key);

    // make sure the values match
    expect(newValue).to.eq(value);
  });
});