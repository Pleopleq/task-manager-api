const express = require("express")
require("./db/mongoose")
const User = require("./models/User")
const Task = require("./models/Task")
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        return res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("/users/:id", async (req, res) => {
    const getUserByID =  await User.findOne({ _id: req.params.id })
    try {
        if(!getUserByID){
            return res.status(404).send()
        }
        
        return res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})

        return res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("/tasks/:id", async (req, res) => {
    const taskById = await Task.findOne({ _id: req.params.id })
    try {
        if(!taskById){
            return res.status(404).send()
        }

        return res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
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