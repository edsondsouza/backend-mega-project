import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    // listener
    app.on("error", (error)=>{
        console.log("ERROR: Failed to run the server: ", error);
        throw error;
    })

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("ERROR: MongoDB connection failed!!", error);
  });
