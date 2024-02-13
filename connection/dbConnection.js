const mongoose =  require('mongoose')

const connectToDatabase = async () => {
  try{
    const connection = await mongoose.connect(process.env.CONNECTION_URL)
    console.log("CONNECTION SUCCESS: ", connection.connection.name, connection.connection.port)
  } catch(e){
    console.log("error connecting to database: ", e)
  }
}

module.exports = connectToDatabase