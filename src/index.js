const express = require("express")
require("./db/mongoose")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/tasks")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`)
})