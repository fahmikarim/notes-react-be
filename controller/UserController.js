import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const Register = async (req, res) => {
    const { name, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 5);

    try {
        const data = await Users.create({
            name,
            password: hashPassword,
        });

        res.status(201).json({
            msg: "User registered successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Failed to register user",
            error: error.message,
        });
    }
}

const Login = async (req, res) => {
    const {name, password} = req.body;

    try {
        const user = await Users.findOne({ where: { name }});

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                msg: "Invalid password",
            });
        }

        const accessToken = jwt.sign(
            {user_id: user.user_id, name : user.name},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            {user_id: user.user_id, name : user.name},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        await Users.update (
            { refresh_token: refreshToken },
            { where: { user_id: user.user_id } }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day",
        });

        return res.status(200).json({
            accessToken,
            message: "Login successful",
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Failed to login",
            error: error.message,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                msg: "Refresh token not found",
            });
        }

        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken,
            },
        });

        if (!user) return res.status(403).json({
            msg: "User not found",
        })

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    msg: "Invalid refresh token",
                });
            }

            const { user_id, name } = user;
            const accessToken = jwt.sign(
                { user_id, name },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );
            res.json({
                accessToken,
            });
        });

    } catch (error){
        res.status(500).json({
            msg: "Failed to refresh token",
            error: error.message,
        });
    }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(204).json({
        msg: "Logout successful",
      });
    }

    const user = await Users.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      return res.status(204).json({
        msg: "Logout successful",
      });
    }

    await Users.update(
      { refresh_token: null },
      { where: { user_id: user.user_id } }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({
      message: "Logout berhasil",
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};


export { Register, Login, refreshToken, logout };