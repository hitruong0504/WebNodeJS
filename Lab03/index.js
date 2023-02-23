const express = require('express');
const bp = require('body-parser');
const emailValidator = require('email-validator');
const multer = require('multer');

const upload = multer({
    dest: 'uploads/', fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }, limits: {fileSize: 1024 * 1024}
});
const app = express();
app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('./index');
})

app.get('/add', (req, res) => {
    res.render('./add', {name: '', price: ''});
})

app.post('/add', (req, res) => {
    let uploader = upload.single('image')
    uploader(req, res, (err) => { 
        
        let product = req.body;
        let image = req.file;
        let error = '';
        if (!product.name) {
            error = 'Name is required';
        }
        else if (!product.price) {
            error = 'Price is required';
        }
        else if (isNaN(product.price)) {
            error = 'Price is invalid';
        }
        else if (!image) {
            error = 'Image is required';
        }
        else if (err) { 
            error = 'Image too large';
        }

        if (error) { 
            res.render('./add', { errorMsg: error, name: product.name, price: product.price });
        }else
            res.send('Add product successfully');
    })
})

app.get('/login', (req, res) => {
    res.set('Content-Type', 'text/html');
    // res.send('Login page');
    res.render('./login', {email: '', password: '' });
})

app.post('/login', (req, res) => {
    let account = req.body;
    let error = '';
    if (!account.email) {
        error = 'Email is required';
    }
    else if (!emailValidator.validate(account.email)) {
        error = 'Email is invalid';
    }
    else if (!account.password) {
        error = 'Password is required';
    }
    else if (account.password.length < 6) {
        error = 'Password is too short';
    }
    else if (account.email !== 'admin@gmail.com' || account.password !== '123456') { 
        error = 'Email or password is incorrect';

    }

    if(error) {
        res.render('./login', { errorMsg: error, email: account.email, password: account.password });
    } else {
        res.send('Login successfully')
    }
})

app.use((req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('404');
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});