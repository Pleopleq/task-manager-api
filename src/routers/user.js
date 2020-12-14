const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")
const router = new express.Router() 

router.get("/users/me", auth, (req, res) => {
    res.send(req.user)
})

router.get("/users/:id", async (req, res) => {
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

router.post("/users", async (req, res) => {
    const newUser = new User(req.body)
    try {
        await newUser.save()
        const token = await newUser.generateAuthToken()
        res.status(201).send({ newUser, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})

router.patch("/users/:id", async (req, res) => {
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

    try {
        const updatedUser = await User.findById(userId)

        updates.forEach((update) => updatedUser[update] = req.body[update] )

        await updatedUser.save()

        if(!updatedUser) {
            return res.status(404).send()
        }
        
        return res.send(updatedUser)
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.delete("/users/:id", async (req, res) => {
    try {
       const deletedUser = await User.findByIdAndDelete(req.params.id)
       
       if (!deletedUser) {
           return res.status(404).send()
       }

       res.send(deletedUser)
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router