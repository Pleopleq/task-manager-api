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
        
        return res.send(getUserByID)
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
        return res.status(500).send(error)
    }
})

app.patch("/users/:id", async (req, res) => {
    const userId = req.params.id
    const fieldToUpdate = req.body
    const updates = Object.keys(fieldToUpdate)
    const allowedUpdates = ["name", "email", "password", "age"]
    
    const isUpdateValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    

    if(!isUpdateValid){
        return res.status(400).send({ error: "Invalid updates" })
    }

    const updatedUser = await User.findByIdAndUpdate(userId, fieldToUpdate, { new: true, runValidators: true })
    try {
        if(!updatedUser) {
            return res.status(404).send()
        }
        
        return res.send(updatedUser)
    } catch (error) {
        return res.status(400).send(error)
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

        return res.send(taskById)
    } catch (error) {
        res.status(500).send(error)
    }
})


app.post("/tasks", async (req, res) => {
    const newTask = new Task(req.body)
    try {
        await newTask.save()
        return res.status(201).send(newTask)
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.patch("/tasks/:id", async (req, res) => {
    const taskId = req.params.id
    const fieldToUpdate = req.body
    const updates = Object.keys(fieldToUpdate)
    const allowedUpdates = ["completed", "description"]

    const isUpdateValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isUpdateValid){
        return res.status(400).send({ error: "Invalid updates" })
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, fieldToUpdate, { new: true, runValidators: true })
    try {
        if(!updatedTask){
            return res.status(404).send()
        }

        return res.send(updatedTask)
    } catch (error) {
        return res.status(400).send(error)
    }
})


app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`)
})