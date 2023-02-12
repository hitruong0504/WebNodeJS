const http = require('http');
const fs = require('fs');
const URL = require('url');
const qs = require('querystring');

http.createServer((req, res) => {

    let url = URL.parse(req.url, true);
    let path = url.pathname;

    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile('index.html', (err, data) => {
            if (err) throw err;
            res.write(data);
            res.end();
        })
    }
    if (path === '/login' && req.method === 'POST') {
        res.writeHead(200, { 'content-Type': 'text/html' })
        let body = '';
        let email = '';
        let password = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let params = qs.decode(body);
            if (!params.email || !params.password || params.email === '' || params.password === '') { 
                res.end('<h1>Invalid email or password</h1>');
            }
            if (params.password.length < 6) { 
                res.end('<h1>Password must be at least 6 characters</h1>');
            }
            email = params.email;
            password = params.password;
            if (email === 'admin@gmail.com' && password === '123456') {
                res.end('<h1>Login success</h1>');
            } else {
                res.end('<h1>Login failed</h1>');
            }
        })
    }
    if (path === '/login' && req.method === 'GET') {
        res.writeHead(200, { 'content-Type': 'text/html' })
        res.end('<h1>Method not allowed</h1>');
    }
    //paths do not exist
    if (path !== '/' && path !== '/login') {
        res.writeHead(404, { 'content-Type': 'text/html' })
        res.end('<h1>404 not found</h1>');
    }

}).listen(3000, () => console.log('Server is running on port 3000'));