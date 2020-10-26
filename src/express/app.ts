import express from 'express';
import routes from './routes';

export default () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }))

    app.use(routes);

    return app;
}