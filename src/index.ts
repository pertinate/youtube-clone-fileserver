import app from './express/app';

export const absPath = '/home/node/fileserver';

const port = process.env.PORT || 8082;

const server = app().listen(port, () => {
    console.log(`Server online on port: ${port}`)
})

