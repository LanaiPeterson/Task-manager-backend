const { default: mongoose } = require("mongoose")

exports.ConnectDB = async () => {
    try {
       const db= await mongoose.connect(process.env.MONGO_URI, )
        console.log('the db is connected to ${db.connection.host} ')

    } catch (error) {
        await mongoose.disconnect();
        process.exit(1)

    }

}