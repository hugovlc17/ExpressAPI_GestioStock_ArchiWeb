import http from 'http';
import app from './app.js';

const server = http.createServer(app);

server.listen(3000, () => {
    console.log("Le serveur fonctione sur localhost:3000 !");
})
