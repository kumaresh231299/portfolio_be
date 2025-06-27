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
app.post("/send-mail", async (req, res) => {
    const { name, email, message } = req.body;

    console.log("EMAIL:", process.env.NODEMAILER_MAIL);
    console.log("PWD:", process.env.NODEMAILER_PWD ? "Loaded" : "Missing");


    // Setup transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // false for port 587
        auth: {
            user: process.env.NODEMAILER_MAIL,
            pass: process.env.NODEMAILER_PWD,
        },
        tls: {
            rejectUnauthorized: false, //  allows self-signed certificates
        }
    });


    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.NODEMAILER_MAIL}>`,
        to: process.env.NODEMAILER_MAIL,
        replyTo: email,
        subject: `New message from ${name} via portfolio contact form`,
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">📬 New Message from Portfolio</h2>
      <p>You've received a new message via your contact form.</p>

      <hr style="border: none; border-top: 1px solid #eee;" />

      <p><strong>👤 Name:</strong> ${name}</p>
      <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>💬 Message:</strong></p>
      <p style="margin-left: 20px; background: #f9f9f9; padding: 10px; border-left: 4px solid #007BFF;">
        ${message}
      </p>

      <hr style="border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 0.9em; color: #777;">You can reply directly to this email to respond to the sender.</p>
      <p style="font-size: 0.9em; color: #777;">-- Kumaresan ✉️</p>
    </div> 
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send("Message sent successfully!");
    } catch (error) {
        console.error("Send mail error:", error);
        res.status(500).send("Failed to send message.");
    }
});


//Default Router 
app.get('/', (req, res) => {
    res.status(200).send("Hi,Welcome to my portfolio!")
})

//Listen
app.listen(PORT, () => {
    console.log("App is started and running on the port");
})