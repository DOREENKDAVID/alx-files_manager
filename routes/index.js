// eslint-disable-next-line no-unused-vars
import { Express } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';
const app = express.Router();

/**
 * inject endpoints of our API
 * @param {Express} api
 */

    api.get('/status', AppController.getStatus);
    api.get('/status', AppController.getStats);

    api.get('/connect', AuthController.getConnect);
    api.get('/disconnect', AuthController.getDisconnect);

    api.post('/users', UsersController.postNew);
    api.get('/users/me', UsersController.getMe);

    api.post('/files', FilesController.postUpload);
    api.get('/files/:id', FilesController.getShow);
    api.get('/files',  FilesController.getIndex);
    api.put('/files/:id/publish', FilesController.putPublish);
    api.put('/files/:id/unpublish', FilesController.putUnpublish);
    api.get('/files/:id/data', FilesController.getFile);

    export default api;
