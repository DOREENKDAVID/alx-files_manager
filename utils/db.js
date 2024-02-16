import { MongoClient } from 'mongodb';

class DBClient {
  /**
     * momgDB client
     */

  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_POST || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
    
  }

  /**
     * client's connection to the MongoDB server
     * @returns {boolean}
     */

  isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected()
  }

  /**
     * counts the number of users in the usrs table
     * @returns promise
     */
  async nbUsers() {
    const users = await this.client.db().collection('users').countDocuments();
    return users
  }

  /**
     * number of documents in the collection files
     * @returns promise
     */
  async nbFiles() {
    const files = await this.client.db().collection('files').countDocuments();
    return files
  }

  /**
   * Retrieves a reference to the `users` collection.
   * @returns {Promise<Collection>}
   */
  async usersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves a reference to the `files` collection.
   * @returns {Promise<Collection>}
   */
  async filesCollection() {
    return this.client.db().collection('files');
  }
}

const dbClient = new DBClient();
export default dbClient;
