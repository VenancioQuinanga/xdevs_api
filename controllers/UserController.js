//teste
//teste..
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const createUserToken = require('../helpers/create-user-token')
const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {

    static async register(req, res) {

      let newUser = {
          name : req.body.name,
          email : req.body.email,
          password : req.body.password,
          confirmpassword : req.body.confirmpassword
      }
  
      // validations
      if (!newUser.name) {
        res.status(422).json({ message: 'O nome é obrigatório!' })
        return
      }
  
      if (!newUser.email) {
        res.status(422).json({ message: 'O email é obrigatório!' })
        return
      }
  
      if (!newUser.password) {
        res.status(422).json({ message: 'A senha é obrigatória!' })
        return
      }
  
      if (!newUser.confirmpassword) {
        res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
        return
      }
  
      if (newUser.password != newUser.confirmpassword) {
        res
          .status(422)
          .json({ message: 'A senha e a confirmação precisam ser iguais!' })
          return
      }
  
      // check if user exists
      const userExists = await User.findOne({where:{ email: newUser.email }})
  
      if (userExists) {
        res.status(422).json({ message: 'Por favor, utilize outro email!' })
        return
      }else{

        try {

          User.create(newUser)
          .then(()=>{
              console.log('usuário criado com sucesso!')
          })
          .catch(()=>{
              console.log('Erro ao criar usuário!')
          })

        } catch (error) {
          res.status(500).json({message:error})
        }
      }

        await createUserToken(newUser, req, res)
      
    }

    static async login(req, res) {
      const email = req.body.email
      const password = req.body.password
  
      if (!email) {
        res.status(422).json({ message: 'O email é obrigatório!' })
        return
      }
  
      if (!password) {
        res.status(422).json({ message: 'A senha é obrigatória!' })
        return
      }
  
      // check if user exists
      const user = await User.findOne({where:{ email: email }})
  
      if (!user) {
        return res
          .status(422)
          .json({ message: 'Não há usuário cadastrado com este email!' })
      }
  
      if (password !== user.password) {
        return res.status(422).json({ message: 'Senha inválida' })
      }
  
      await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
      let currentUser

      console.log(req.headers["authorization"])

      if (req.headers.authorization) {
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')

        currentUser = await User.findOne({where:{id:decoded.id}})

        currentUser.password = undefined
      } else {
        currentUser = null
      }

      res.status(200).json({user:currentUser})
    }

    static async getUserById(req, res) {
      const id = req.params.id

      const user = await User.findOne({where:{id:id}})

      if (!user) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
      }

      res.status(200).json({ user })
    }
    
    static async getUserByToken(req, res){
      const token = req.params.token

      if (!token) return res.status(401).json({ error: "Acesso negado!" });

      // find user
      const decoded = jwt.verify(token, "nossosecret");
    
      const userId = decoded.id;
    
      const user = await User.findOne({where:{ id: userId }});
    
      return res.status(401).json({ user: user });
    }

    static async getAllUsers(req, res) {

        User.findAll()
        .then((user)=>{
            res.status(200).json({users:user})
        })
        .catch ((error)=> {
            res.status(500).json({ message: error })
        })
    }

    static async editUser(req, res) {
  
      const name = req.body.name
      const email = req.body.email
      const password = req.body.password
      const confirmpassword = req.body.confirmpassword

      // validations
      if (!name) {
        res.status(422).json({ message: 'O nome é obrigatório!' })
        return
      }
  
      if (!email) {
        res.status(422).json({ message: 'O email é obrigatório!' })
        return
      }
  
      // check if password match
      if (password !== confirmpassword) {
        res.status(422).json({ message: 'As senhas não conferem.' })
        return
        // check if isnt null password
      } else if (password == null) {
  
        res.status(304).json({ message: 'Senha invalida' })
        return
      }
 
      User.findOne({where: {id : req.params.id}})
      .then((User)=>{
        User.name = req.body.name
        User.email = req.body.email
        User.password = req.body.password
        
        if (req.file) {
          User.image = req.file.filename
        } else {
          User.image = User.image
        }

        User.save()
        .then(()=>{
          res.json({
            message: 'Usuário atualizado com sucesso!',
            data: User,
          })
        })
        .catch(()=>{
          res.status(500).json({ message: 'Erro ao editar usuário!' })
        })
        
      })
      .catch(()=>{
        res.status(500).json({ message: 'Erro ao achar usuário!' })
      })
    
    }
  
}  