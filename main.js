import nodemailer from "nodemailer"
import "dotenv/config"
import fs from "fs";
import http from "http";
import { URL } from "url";

const invitationStr = fs.readFileSync("html/invitation.html", "utf-8");
const meetingStr = fs.readFileSync("html/meeting.html", "utf-8");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "wais.cshs@gmail.com",
        pass: process.env.password
    }
});

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const key = url.searchParams.get("key");

    if (key !== process.env.key) {
        res.writeHead(403, {"Content-Type": "application/json"});
        res.end(JSON.stringify({status: "Forbidden", message: "You do not have permission to access this resource"}));
        return;
    }

    if (url.pathname === "/invite" && req.method === 'POST') {
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
                }, (error, info) => {
                    if (error) {
                        res.writeHead(500, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({status: "error", message: error.message}));
                    } else {
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({status: "success", message: "Email sent"}));
                    }
                });

            } catch (error) {
                res.writeHead(400, {"Content-Type" : "application/json"});
                res.end(JSON.stringify({status: "error", message: error.message}));
            }
        });
    } else if (url.pathname === "/meeting" && req.method === "POST") {
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
                    html: meetingStr,
                }, (error, info) => {
                    if (error) {
                        res.writeHead(500, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({status: "error", message: error.message}));
                    } else {
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({status: "success", message: "Email sent"}));
                    }
                });

            } catch (error) {
                res.writeHead(400, {"Content-Type" : "application/json"});
                res.end(JSON.stringify({status: "error", message: error.message}));
            }
        });
    } else {
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({status: "Page Not Found", message: "The page you are looking for could not be found"}));
    }
});

server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});