const express = require('express')
const app = express.Router()
const { check, validationResult, cookie } = require('express-validator')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const db = require('../db')
const bcrypt = require('bcrypt')

// app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieParser('520h0356'))
app.use(session({cookie: { maxAge: 60000 }}))
app.use(flash())

const loginValidate = [
    check('email').exists().withMessage('Please enter your email')
        .notEmpty().withMessage('Email is not empty')
        .isEmail().withMessage('Email is not valid'),
    check('password').exists().withMessage('Please enter your password')
        .notEmpty().withMessage('Password is not empty')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]
const validate = [
    check('name').exists().withMessage('Please enter your name')
        .notEmpty().withMessage('Name is not empty')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    check('email').exists().withMessage('Please enter your email')
        .notEmpty().withMessage('Email is not empty')
        .isEmail().withMessage('Email is not valid'),
    check('password').exists().withMessage('Please enter your password')
        .notEmpty().withMessage('Password is not empty')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('confirmPassword').exists().withMessage('Please enter your confirm password')
        .notEmpty().withMessage('Confirm password is not empty')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
]

app.get('/login', (req, res) => {
    let error = req.flash('error') || ''
    res.render('login', { error })
})

app.post('/login', loginValidate, (req, res) => { 
    const { email, password } = req.body
    let result = validationResult(req)
    console.log(result.errors.length);
    if (result.errors.length === 0) { 
        const sql = 'select * from account where email = ?'
        const params = [email]
        db.query(sql, params, (err, result, fields) => { 
            if (err) { 
                throw err
            } else if(result.length === 1){
                const hash = result[0].password
                if (bcrypt.compareSync(password, hash)) {
                    delete result[0].password
                    req.session.user = result[0]
                    return res.redirect('/')
                }
            }
            req.flash('error', 'Email or password is not correct')
            res.redirect('/account/login')
        })
        return;
    }
    result = result.mapped()
    let message;
    for (fields in result) {
        message = result[fields].msg
        break
    }
    req.flash('error', message)
    res.redirect('/account/login')
})

app.get('/register', (req, res) => {
    const error = req.flash('error') || ''
    const name = req.flash('name') || ''
    const email = req.flash('email') || ''
    res.render('register', {error, name, email})
})

app.post('/register', validate, (req, res) => {
    const {confirmPassword, name, email, password} = req.body
    // res.json(req.body)
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const hash = bcrypt.hashSync(password, 10)
        const sql = 'insert into account (name, email, password) values (?, ?, ?)'
        const params = [name, email, hash]
        db.query(sql, params, (err, result, fields) => { 
            if (err) { 
                throw err
            } else if(result.affectedRows === 1){
                return res.redirect('/account/login')
            }
            return res.send('Register success')
        })
        return;
    }
    result = result.mapped()
    let message;
    for (fields in result) {
        message = result[fields].msg
        break
    }
    req.flash('error', message)
    req.flash('name', name)
    req.flash('email', email)
    res.redirect('/account/register')
})

module.exports = app