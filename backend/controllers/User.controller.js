const User = require("../models/usermodel");

const register = async (res, req) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json(user);

    } catch (error) {
        console.log(error)
    }
}

module.exports = { register }