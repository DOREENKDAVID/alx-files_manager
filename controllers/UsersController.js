import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
    }

    let emailExists;
    try {
      emailExists = await dbClient.users.findOne({ email });
    } catch (err) {
      console.log(err);
    }

    if (emailExists) {
      res.status(400).json({ error: 'Already exist' });
    }

    const passwordHash = sha1(password);
    let user;
    try {
      user = await dbClient.users.insertOne({ email, password: passwordHash });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error. Error creating user' });
    }
    const newUser = { id: user.insertedID, email };
    return res.status(201).send(newUser);
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const id = new ObjectId(userId);
    const user = await dbClient.users.findOne({ _id: id });
    console.log(user);
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
    }
    return res.send({ email: user.email, id: user._id });
  }
}
export default UsersController;
