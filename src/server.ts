import http from 'http';
import { characters } from './data/characters';

const server = http.createServer((req, res) => {
    const {method, url} = req;

    if (method === 'GET' && url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return;    
    }
    
    if (method === 'GET' && url === '/characters') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(characters));
        return;
    }
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
    console.error('Server error:', err);
    process.exit(1);
});