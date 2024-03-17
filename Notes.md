# DB Connection

- To connect to the database IP Address, Username-Password and a String is required.

> [!TIP]
>
> - Whenever trying to communicate with the database, problem will arise. Wrap DB Connection code inside _try-catch_.
> - DB is always in other Continent. Meaning it will take time, use _async-await_.

## DB connection inside index.js file

Not good approach, pollutes index file.

```javascript
// index.js
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    // listeners
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
    // if no error
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
```

## process.exit

Read the [Documentation](https://nodejs.org/api/process.html#event-exit)

## Return Object from Mongoose

Mongoose always gives you a return object when connecting to the database. This is handled by mongoose. In the below code variable _connectionInstance_ is the return object.

```javascript
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
  } catch (error) {
    console.log("MONGODB Connection error ", error);
    process.exit(1);
  }
};
```

## dotenv Configutation

The below code will work successfully. But do not use this if type _module_ is followed in the project. This will ruin the consistency

```javascript
require("dotenv").config({ path: "./env" });
```

If using the import statement, use dotenv as experimental feature 👇

```javascript
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});
```

```bash
// package.json
"scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}
```
