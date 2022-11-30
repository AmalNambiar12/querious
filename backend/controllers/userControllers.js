const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const dbhandler = require('../app');
const bcrypt = require('bcrypt');
const salt = "$2b$10$M8FZupbIr4gYPjB836M90O";

const registerUser = asyncHandler(async (req, res)=> {
    const {username, password} = req.body;
    //const salt = await bcrypt.genSalt(10);
    //console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!username || !password){
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    //check if user exists in the database 
    if (await dbhandler.userExists(username)){
        res.status(400);
        throw new Error('User already exists');
    }

    //create new user
    const userAdded = await dbhandler.addUser(username, hashedPassword);
    
    if (userAdded){
        const user = await dbhandler.returnUser(username);
        res.status(201).json({
            userID: user.userID,
            username: user.username,
            token: generateToken(user.userID)
        });
    }else{
        res.status(400);
        throw new Error('Failed to create User');
    }

    // if (user){
    //     res.status(201).json({
    //         username:username
    //     });
    // }else{
    //     res.status(400);
    //     throw new Error("Failed to create the User");
    // }

});

const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    //const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userExists = await dbhandler.userExists(username);
    const x = await dbhandler.matchPassword(username, hashedPassword);
    console.log(userExists);
    console.log(x);

    if (userExists && x) {
        const user = await dbhandler.returnUser(username);
        res.status(201).json({
            id: user.userID,
            username: user.username,
            token: generateToken(user.userID)
        });
    }else {
        res.status(401);
        throw new Error("Invalid Username or Password");
    }
})

module.exports = { registerUser, authUser }