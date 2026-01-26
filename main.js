import nodemailer from "nodemailer"
import "dotenv/config"
import fs from "fs";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "wais.cshs@gmail.com",
        pass: process.env.password
    }
});

const htmlStr = fs.readFileSync("html/formated_invitation.html", "utf-8");
console.log(htmlStr);

await transporter.sendMail({
    from: "wais.cshs@gmail.com",
    to: "shettsid000@mysbisd.org",
    subject: "Invitation to CSHS",
    html: htmlStr,
});
