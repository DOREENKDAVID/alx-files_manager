import { promisify } from 'util';
import { createClient } from 'redis';
import { del } from 'request';

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
        this.client.on_connect('error', (err) => {
            console.error('Redis failed to connect:', err.message || err.toString());
            this.isClientConnected = false;
        });
        this.client.on_connect('connect', () => {
            this.isClientConnected = true
        });
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
        return promisify(this.client.GET).bind(this.client)(key);
    }

    /**
     * stotes a key and value with an expiry time
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
        await promisify(this.client.DEL).bind(this.client)(key)
    }
    
} 

export const redisClient = new RedisClient();
export default redisClient;
