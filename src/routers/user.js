const express = require("express")
const multer = require("multer")
const User = require("../models/User")
const auth = require("../middleware/auth")
const router = new express.Router() 
const upload = multer({
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error("File must be JPG or PNG."))
        }
 
        cb(undefined, true) 
    }
})

router.get("/users/me", auth, (req, res) => {
    res.send(req.user)
})

router.get("/users/:id/avatar", async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set("Content-Type", "image/jpg")
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send().end()
    }
})

router.post("/users/me/avatar", auth, upload.single("avatar") , async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send();
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

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send({ success: "You log out from all sessions!"})
    } catch (error) {
        res.status(500).send()
    }
})

router.patch("/users/me", auth, async (req, res) => {
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
        updates.forEach((update) => req.user[update] = fieldToUpdate[update] )

        await req.user.save()
        
        return res.send(req.user)
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove()

       res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router