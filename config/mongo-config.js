import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connection: Success"))
    .catch((err) => console.log(err));