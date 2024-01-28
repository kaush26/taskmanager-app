import { User } from "../models/User.js";
import { encode } from "../utils.js";
import bcrypt from 'bcryptjs'

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(11);
    const hashedPassword = bcrypt.hashSync(password.toString(), salt);

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email id already registered!');

    const user = new User({ username, email, password: hashedPassword });
    const { _id } = await user.save();

    res.json({ token: encode({ username, userId: _id }) })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password = "" } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new Error('User not registered!')

    const existingPassword = existingUser.password;
    const isAuth = bcrypt.compareSync(password.toString(), existingPassword);

    if (!isAuth) throw new Error('Incorrect password');
    res.json({ token: encode({ username: existingUser.username, userId: existingUser._id }) })
  } catch (err) {
    next(err)
  }
}

