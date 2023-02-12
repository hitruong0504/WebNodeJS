const http = require('http');
const fs = require('fs');
const URL = require('url');



http.createServer((req, res) => {
    let url = URL.parse(req.url, true);
    if (url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile('./index.html', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.write(data);
                res.end();
            }
        });
    }
    else if (url.pathname === '/result') {
        res.writeHead(200, {'Content-Type': 'text/html' });
        let query = url.query;
        if (!query.num1) {
            return res.end('Please enter an operator 1');
        }
        if (!query.num2) {
            return res.end('Please enter an operator 2');
        }
        if (!query.op) {
            return res.end('Please select an operator');
        }
        let num1 = parseInt(query.num1);
        let num2 = parseInt(query.num2);
        let op = query.op;
        switch (op) { 
            case '+':
                res.write(`<h2>${num1} + ${num2} = ${num1 + num2}</h2>`);
                res.end();
                break;
            case '-':
                res.write(`<h2>${num1} - ${num2} = ${num1 - num2}</h2>`);
                res.end();
                break;
            case '*':
                res.write(`<h2>${num1} * ${num2} = ${num1 * num2}</h2>`);
                res.end();
                break;
            case '/':
                if (num2 == 0) {
                    return res.end('Cannot divide by zero');
                }
                res.write(`<h2>${num1} / ${num2} = ${num1 / num2}</h2>`);
                res.end();
                break;
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h2>404 Not Found</h2>');
        res.end();
    }


}).listen(3000, () => {
    console.log('Server is running on port 3000');
});