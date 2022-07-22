const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const {logger} = require('./middleware/logEvents')
const {errorHandler} = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500;

app.use(express.urlencoded({
    extended: false
}))

app.use(express.json())

app.use(logger)

app.use(cors(corsOptions))

const staticFiles = express.static(path.join(__dirname, '/public'))
app.use('/', staticFiles)
app.use('/subdirectory', staticFiles)

app.use('/', require('./routes/root'))
app.use('/subdirectory', require('./routes/subdirectory'))
app.use('/employees',require('./routes/api/employees'))

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World!');
});


// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);

/*
app.get('/!*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})
*/

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({
            error: '404 Not Found'
        })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));