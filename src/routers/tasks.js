const express = require("express")
const Task = require("../models/Task")
const auth = require("../middleware/auth")
const router = new express.Router()

//GET /tasks?completed=BOOL
//GET /tasks?limit=NUMBER&skip=NUMBER
//GET /task?sortBy=FIELD,ORDER

router.get("/tasks", auth, async (req, res) => {
    try {
        const match = {}
        const sort = {}

        if(req.query.completed) {
            match.completed = req.query.completed === "true"
        }

        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1
        }

        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, author:req.user._id})

        if(!task){
            return res.status(404).send()
        }

        return res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.post("/tasks", auth, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        author: req.user._id
    })

    try {
        await newTask.save()
        return res.status(201).send(newTask)
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
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
        const updatedTask = await Task.findOne({ _id:taskId, author:req.user._id })
        
        if(!updatedTask){
            return res.status(404).send()
        }

        updates.forEach((update) => updatedTask[update] = req.body[update])
        await updatedTask.save()

        return res.send(updatedTask)
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id:req.params.id, author:req.user._id })
        
        if (!deletedTask) {
            return res.status(404).send()            
        }

        res.send(deletedTask)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router