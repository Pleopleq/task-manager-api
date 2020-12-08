const express = require("express")
require("./db/mongoose")
const User = require("./models/User")
const Task = require("./models/Task")
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.get("/users", (req, res) => {
    User.find({})
        .then((users) => {
            res.send(users)
        }).catch((error) => {
            res.send(error)
        })
})

app.get("/users/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            res.send(user)
        }).catch((error) => {
            res.send(error)
        })
})

app.get("/tasks", (req, res) => {
    Task.find({})
        .then((tasks) => {
            res.send(tasks)
        }).catch((error) => {
            res.status(500).send(error)
        })
})

app.post("/users", (req, res) => {
    const newUser = new User(req.body)
    newUser.save()
        .then(() => {
            return res.status(201).send(newUser)
        }).catch((error) => {
            return res.status(400).send(error)
        })
})

app.post("/tasks", (req, res) => {
    const newTask = new Task(req.body)
    newTask.save()
        .then(() => {
            return res.status(201).send(newTask)
        }).catch((error) => {
            return res.status(400).send(error)
        })
})

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`)
})