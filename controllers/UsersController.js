/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';

const userQueue = new Queue('email sending');

export default class UsersController {
    static async postNew(req, res) {
        const email = req.body ? req.body.email : null;
        const password = req.body ? req.body.password : null;

        if (!email) {
            res.status(400).json({ error: 'Missing email' });
            return;
        }
        if (!password) {
            res.status(400).json({ error: 'Missing password' })
        }

        const user = await (await dbClient.usersCollection()).findOne({ email });

        if (user) {
            res.status(400).json({ error: 'Already exist' });
        }

        const insertToDb = await (await dbClient.usersCollection()).insertOne
            ({ email, password: sha1(password) });
        const userid = insertToDb.insertedId.toString();

        userQueue.add({ userid });
        res.status(201).json({email, id: userid });

    }

    static async getMe(req, res) {
        const { user } = req;
        res.status(200).json({ email: user.email, id: user._id.toString() });

    }
}
