require("dotenv").config()
const express = require('express')
const cors = require('cors')
const UsersRouter = require('./routes/UserRouter')
const app = express()

// Config JSON response
app.use(express.json())

// Solve CORS
const p = '5173'
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }))

// Public folder for images
app.use(express.static('public'))

app.use('/users', UsersRouter)

const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log('servidor rodando na porta :',PORT)
})
