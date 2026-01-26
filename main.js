import nodemailer from "nodemailer"
import "dotenv/config"
import fs from "fs";
import http from "http";

const invitationStr = fs.readFileSync("html/invitation.html", "utf-8");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "wais.cshs@gmail.com",
        pass: process.env.password
    }
});

const server = http.createServer((req, res) => {
    if (req.url === "/head") {
        res.writeHead(200);
        res.end();
    }
    else if (req.url === "/invite" && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                transporter.sendMail({
                    from: "wais.cshs@gmail.com",
                    to: data.people,
                    subject: "Invitation to CSHS",
                    html: invitationStr,
                });

            } catch (error) {
                res.writeHead(400, {"Content-Type" : "application/json"});
                res.end(JSON.stringify({status: "error", message: error}));
            }
        });
    } else {
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({status: "Page Not Found", message: "The page you are looking for could not be found"}));
    }
});

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});