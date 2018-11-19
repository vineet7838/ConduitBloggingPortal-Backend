const express = require('express')
const {
  db
} = require('./db/index.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use('/api/users', require('./routes/api/users'))


db.sync()
  .then(() => {
    console.log('Database synced')
    app.listen(3939, () => {
      console.log('Server started http://localhost:3939')
    })
  })
  .catch(console.error)