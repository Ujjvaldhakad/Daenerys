const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const Newuser = await User.create({
            username,
            email,
            password: hashPassword
        });

        await Newuser.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatched = bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({ message: `${user.username} logged in successfully` });

    } catch (error) {
        console.log(error)
    }
}

module.exports = { register, login }