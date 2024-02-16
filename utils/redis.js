import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * RedisClient class
 */

class RedisClient {
  /**
     * RedisClient instance
     */

  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
    this.clientAsyncGet = promisify(this.client.get).bind(this.client);
    this.clientAsyncDel = promisify(this.client.del).bind(this.client);
  }

  /**
     * returns true when the connection to Redis is a success
     * otherwise, false
     */
  isAlive() {
    return this.isClientConnected;
  }

  /**
     * @param {string} key to retrieved
     * @returns {string | object}
     */
  async get(key) {
    const value = await this.clientAsyncGet(key);
    return value;
  }

  /**
     * stores a key and value with an expiry time
     * @param {string} key to store
     * @param {string | number| Boolean}
     * @param {number}
     * @returns {promise}
     */
  async set(key, value, expire) {
    await promisify(this.client.SETEX).bind(this.client)(key, expire, value);
  }

  /**
     * deletes the value of a given key
     * @param {String} key to remove.
     * @returns {Promise<void>}
     */
  async del(key) {
    await this.clientAsyncDel(key)
  }
}

const redisClient = new RedisClient();
export default redisClient;
