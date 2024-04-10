const Sequelize = require('sequelize')
const sequelize = new Sequelize('xdevs','root','',{
    host:'localhost',
    dialect:'mysql'
})
/*
const Sequelize = require('sequelize')
const sequelize = new Sequelize('xdevs','root','',{
    host:'localhost',
    dialect:'mysql'
})

sequelize.authenticate().then(()=>{
    console.log('sucesso')
})
.catch(()=>{
    console.log('erro')
})

*/

module.exports = {
    sequelize,
    Sequelize
}
