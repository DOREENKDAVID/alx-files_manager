import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';


class DBClient {
    /**
     * momgDB client
     */

    constructor() {
        envLoader();
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_POST || 27017;
        const database = process.env.DB_DATABASE || 'files_manager'
        const dbURL = `mongodb://${host}:${port}/${database}`;

        this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
        this.client.connect();
    }

    /**
     * client's connection to the MongoDB server 
     * @returns {boolean}
     */

    isAlive() {
        return this.client.isConnected();
    }

    /**
     * counts the number of users in the usrs table
     * @returns promise
     */
    async nbUsers() {
        return this.client.db().Collection('users').countDocuments();
    }

    /**
     * number of documents in the collection files
     * @returns promise
     */
    async nbFiles() {
        return this.client.db().Collection('files').countDocuments();
    }

    async usersCollection() {
        return this.client.db().collection('users')
    }

    async filesCollection() {
        return this.client.db().collection('files')
    }
}

export const dbClient = new DBClient();
export default dbClient;