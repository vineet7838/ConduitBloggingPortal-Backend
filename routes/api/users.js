const {
    Router
  } = require('express')

  const {
    User
  } = require('../../db/index')
  
  const route = Router()
  
 
  
  route.post('/', async (req, res) => {
    try{
    const newUser = await User.create({
      username: req.body.user.username,
      email: req.body.user.email,
      password: req.body.user.password

    })
    res.status(201).json({
        "user": {
            "email": newUser.email,
            "username": newUser.username,
            "bio": newUser.bio,
            "image": newUser.image
          }

    })}catch(e){
        console.error(e)
        res.status(500).json({
          message: 'Error inserting into database'
        })
    
    }
  })
  

  route.post('/login', async (req,res)=>{
      try{
        if(req.body.user.email && req.body.user.password){
            const newUser = await User.findOne({
                where:{
                    email: req.body.user.email,
                    password: req.body.user.password
                }
            })
            res.status(201).json({
                "user": {
                    "email": newUser.email,
                    "username": newUser.username,
                    "bio": newUser.bio,
                    "image": newUser.image
                  }
        
            })
        	if(!newUser){
                return res.status(400).json({
                    message: 'User not found'
                    }) 
                 }
        }
      }catch(e){
        console.error(e)
        res.status(500).json({
          message: 'Error in login '
        })
      }

  })
  module.exports = route