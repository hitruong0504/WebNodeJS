const express = require('express')
const session = require('express-session')
const AccountRouter = require('./routers/AccountRouter')
const app = express()
const port = process.env.PORT || 8080

app.set('view engine', 'ejs')
app.use(session({
    secret: '520h0356',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    if (!req.session.user) { 
        return res.redirect('/login')
    }
    const user = req.session.user
    res.render('index', {user})
})
app.get('/login', (req, res) => {
    if (req.session.user) { 
        return res.redirect('/')
    }
    res.render('login')
})
app.get('/logout', (req, res) => { 
    req.session.destroy()
    res.redirect('/login')
})
app.get('/register', (req, res) => res.render('register'))
app.use('/account', AccountRouter)
app.listen(port, () => console.log(`http://localhost:${port}`))