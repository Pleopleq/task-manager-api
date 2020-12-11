const express = require("express")
const Task = require("../models/Task")
const router = new express.Router()

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})

        return res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/tasks/:id", async (req, res) => {
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


router.post("/tasks", async (req, res) => {
    const newTask = new Task(req.body)
    try {
        await newTask.save()
        return res.status(201).send(newTask)
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.patch("/tasks/:id", async (req, res) => {
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

    
    try {
        const updatedTask = await Task.findById(taskId)
        updates.forEach((update) => updatedTask[update] = req.body[update])
        await updatedTask.save()

        if(!updatedTask){
            return res.status(404).send()
        }

        return res.send(updatedTask)
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.delete("/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndRemove(req.params.id)
        if (!deletedTask) {
            return res.status(404).send()            
        }

        res.send(deletedTask)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router