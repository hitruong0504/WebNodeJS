const http = require('http');
const URL = require('url');
const qs = require('querystring');

let students = new Map();

http.createServer((req, res) => {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    let url = URL.parse(req.url, true);
    if (url.pathname === '/students') {
        if (req.method === 'GET') {
            return loadStudents(req, res);
        }
        if (req.method === 'POST') {
            return addStudent(req, res);
        }
        res.writeHead(405, { 'Content-Type': 'text/html' });
        return res.end(JSON.stringify({ code: 405, message: 'Method not allowed' }));
    } else if (url.pathname.startsWith('/students/')){ 
        if (req.method === 'GET') { 
            let id = url.pathname.split('/')[2];
            console.log(id);
            return loadStudent(req, res, id);
        }
        if (req.method === 'PUT') { 
            let id = url.pathname.split('/')[2];
            return updateStudent(req, res, id);
        }
        if (req.method === 'DELETE') { 
            let id = url.pathname.split('/')[2];
            return deleteStudent(req, res, id);
        }
        res.writeHead(405, { 'Content-Type': 'text/html' });
        return res.end(JSON.stringify({ code: 405, message: 'Method not allowed' }));
    }
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return res.end(JSON.stringify({ code: 404, message: 'Not found!!!' }));

}).listen(3000, () => console.log('Server is running on port 3000'));

function addStudent(req, res) { 
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let student = qs.parse(body);
        if (!student.id) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'id is required' }))
        }
        if (!student.name || student.name.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Name is required' }))
        }
        if (!student.age) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Age is required' }))
        }
        if (isNaN(student.age) || !Number.isInteger(Number(student.age))) { 
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Age must be an integer' }))
        }
        if (student.age < 18 || student.age > 100) { 
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Age must be between 18 and 100' }))
        }
        if (students.has(student.id)) { 
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 2, message: 'Student already exists' }))
        } else {
            students.set(student.id, student);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 0, message: 'success', data: student }))
        }
    });
}

function loadStudents(req, res) { 
    if (students.size === 0) { 
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(JSON.stringify({ code: 204, message: 'No content'}))
    }
    let studentsArray = [];
    students.forEach(student => studentsArray.push(student));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(JSON.stringify({ code: 0, message: 'success', data: studentsArray }))
}

function loadStudent(req, res, id) { 
    if (!students.has(id)) { 
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(JSON.stringify({ code: 204, message: 'No content'}))
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(JSON.stringify({ code: 0, message: 'success', data: students.get(id) }))
}

function updateStudent(req, res, id) { 
    if (!students.has(id)) { 
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(JSON.stringify({ code: 204, message: 'No content'}))
    }
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let student = qs.parse(body);
        if (!student.name || student.name.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Name is required' }))
        }
        if (!student.age) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Age is required' }))
        }
        if (isNaN(student.age) || !Number.isInteger(Number(student.age))) { 
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Age must be an integer' }))
        }
        if (student.age < 18 || student.age > 100) { 
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(JSON.stringify({ code: 1, message: 'Age must be between 18 and 100' }))
        }
        students.set(id, student);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(JSON.stringify({ code: 0, message: 'success', data: student }))
    });
}

function deleteStudent(req, res, id) { 
    if (!students.has(id)) { 
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(JSON.stringify({ code: 204, message: 'No content'}))
    }
    students.delete(id);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(JSON.stringify({ code: 0, message: 'success' }))
}