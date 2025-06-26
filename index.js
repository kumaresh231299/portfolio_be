import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json())
app.use(cors({
    origin: "*",
    credentials: true

}))

//Nodemailer - Portfolio Contact 
app.post('/send-mail', async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.NODEMAILER_MAIL,
            pass: process.env.NODEMAILER_PWD,
        },
    });

    const mailOption = {
        from: email,
        to: process.env.NODEMAILER_MAIL,
        subject: `Portfolio Contact : ${name}`,
        text: message
    };

    try {
        await transporter.sendMail(mailOption);
        res.status(200).send("Message send successfully!")
    } catch (error) {
        res.status(500).send("Failed to send message.")
    }


})

//Default Router 
app.get('/', (req, res) => {
    res.status(200).send("Hi,Welcome to my portfolio!")
})

//Listen
app.listen(PORT, () => {
    console.log("App is started and running on the port");
})

