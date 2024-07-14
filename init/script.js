const mongoose = require("mongoose")
const initdata = require("./data.js")
const Listing = require("../models/listing.js")

async function main(){
    await mongoose.connect("mongodb://localhost:27017/wanderlist");
}
main()
    .then(()=>console.log("database connected"))
    .catch(err=>console.log(err))


const initDb  = async()=>{
    await Listing.deleteMany({})
     initdata.data= initdata.data.map((obj) => {
        return { ...obj , 
            owner : "6660785f3b62682d365a7f65"
         }
    })
    await Listing.insertMany(initdata.data)
    console.log("done successfully")
}
initDb();