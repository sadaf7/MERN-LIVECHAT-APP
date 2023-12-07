const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require('./config/db')
const { notFound, errorHandler } = require('../backend/middleware/errorMiddleware')

dotenv.config();

const app = express();
connectToMongo()

const port =  2000

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:false}))

app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/chat',require('./routes/chatRoutes'))
app.use('/api/message',require('./routes/messageRoutes'))

app.use(notFound)
app.use(errorHandler)



app.listen(port, () => {
    console.log(` App started on port ${port}`);
  });