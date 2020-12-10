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
            res.status(500).send(error)
        })
})

app.get("/users/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if(!user){
                return res.status(404).send()
            }

            res.send(user)
        }).catch((error) => {
            res.status(500).send(error)
        })
})

app.get("/tasks", (req, res) => {
    Task.find({}).then((tasks) => {
            res.send(tasks)
        }).catch((error) => {
            res.status(500).send(error)
        })
})

app.get("/tasks/:id", (req, res) => {
    Task.findOne({ _id: req.params.id }).then((task) => {
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

app.post("/users", async (req, res) => {
    const newUser = new User(req.body)
    try {
        await newUser.save()
        return res.status(201).send(newUser)
    } catch (error) {
        return res.status(400).send(error)
    }
})

app.post("/tasks", async (req, res) => {
    const newTask = new Task(req.body)
    try {
        await newTask.save()
        return res.status(201).send(newTask)
    } catch (error) {
        return res.status(400).send(error)
    }
})


app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`)
})