const { urlencoded } = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const app = express();
const userModel = require('./models/user')
const dbConnection = require('./config/db')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use(morgan('dev'));

app.set("view engine", 'ejs')

app.get('/',
    (req, res) => {
        res.render('index');
    }
)

app.get('/about',
    (req, res, next) => {
        console.log("This is custom middleware");
        return next();
    },
    (req, res) => {
        res.send('Hello2');
    })

app.get('/register',
    (req, res) => {
        res.render('register');
    }
)

app.post('/register',
    async (req, res) => {
        const { username, email, password } = req.body;
        const newUser = await userModel.create({
            username: username,
            email: email,
            password: password,
        })
        res.send(newUser);
    }
)

// app.post('/get-form-data', 
//     (req, res) => {
//         console.log(req.body);
//         res.send('data received')
//     }
// )

app.get('/get-users-data',
    (req, res) => {
        userModel.find().then((users) => {
            res.send(users);
        })
    }
)

app.get('/get-user-data',
    (req, res) => {
        userModel.find({
            username: 'Kishant'
        }).then((user) => {
            res.send(user);
        })
    }
)

app.get('/update-user',
    async (req, res) => {
        await userModel.findOneAndUpdate({ username: "s" }, { email: "holaamigo" })
        res.send("user updated");
    })


app.get('/delete-user',
    async (req, res) => {
        await userModel.findOneAndDelete({
            username: "Kishant"
        })
        res.send("user deleted");
    }
)

app.listen(3000);