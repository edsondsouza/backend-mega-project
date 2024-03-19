# DB Connection

- To connect to the database IP Address, Username-Password and a String is required.

> [!TIP]
>
> - Whenever trying to communicate with the database, problem will arise. Wrap DB Connection code inside _try-catch_.
> - DB is always in other Continent. Meaning it will take time, use _async-await_.

# DB connection inside index.js file

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

# process.exit

Read the [Documentation](https://nodejs.org/api/process.html#event-exit)

# Return Object from Mongoose

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

# dotenv Configutation

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

# Express

When an async code gets executed (here DB connection), it will return a promise.

```javascript
connectDB().then().catch();
```

# App listen

So far only the DB is connected. Using DB, the app did not start to listen. Therefore,

```javascript
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!", err);
  });
```

# Throwing error

In JavaScript, the "throw" statement is used to manually throw an exception. When an exception is thrown, it interrupts the normal flow of the program and transfers control to the nearest exception handler. In the given code snippet, the "throw error" statement is used to throw the error that occurred while running the server. By throwing the error, the code ensures that the error is not ignored and is propagated to the nearest exception handler. This allows for proper error handling and debugging of the server application.

```javascript
app.on("error", (error) => {
  console.log("ERROR: Failed to run the server: ", error);
  throw error;
});
```

### Exception Handler 👇

```javascript
.catch((err) => {
    console.log("MongoDB connection failed!!", err);
  });
```

# app.use()

Whenever there is a requirement to setup a middleware or any configuration, **_app.use()_** is used.

# Cookie Parser

Cookie parser is a middleware that is used to parse cookies that are sent by the client to the server. It is used to extract the cookie data from the HTTP request and convert it into a usable format that can be accessed by the server-side code. It also parses the cookie data to extract individual values such as the cookie name, value, and expiration date.

Cookies are small pieces of data that are stored on the user's computer by the web browser. They are used to track user preferences, maintain user sessions, and personalize the user experience.

Cookie parser is used in ExpressJS applications to simplify the process of parsing and managing cookies. It provides developers with convenient access to client-side cookies for various purposes, including session management and security.

Cookie parser is a valuable tool for developers who are building ExpressJS applications. It can help to simplify the process of parsing and managing cookies, and it can provide developers with convenient access to client-side cookies for various purposes.

# Middlewares
![middleware diagram](diagram-export-3-19-2024-6_42_21-AM.png)
When using middleware we use _next_ as the parameter along with _(req, res)_.

# Async Operation Wrapper
```javascript
// asyncHandler.js
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
```

# Nodejs API Error
[documentation](https://nodejs.org/api/errors.html)

Read from the nodejs documentation about the concept of _this.data_

# Error Format
```javascript
// apiError.js
class apiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { apiError };
```

# Success Format
```javascript
// apiResponse.js
class apiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { apiResponse };
```