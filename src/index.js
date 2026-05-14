const nodemailer = require("nodemailer");


export default {
	async fetch(request, env, ctx) {
		const key = env.key;
		
		const transporter = nodemailer.createTransport({
			service : "gmail",
			auth: {
				user: "wais.cshs@gmail.com",
				pass: env.password
			}
		});

		const method = request.method;
		const path = new URL(request.url).pathname;

		const map = new Map();
		map.set("/invite", {path: "join", subject: "CSHS Invitation"});

		if (method === "POST") {

			if (!map.has(path)) {
				return new Response("Invalid Path");
			}
			
			const contentType = request.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				try {
					const payload = await request.json();
					if (payload.key !== key) {
						return new Response("Invalid Key");
					}

					const response = await fetch(`https://raw.githubusercontent.com/WAIScshs/resource/refs/heads/main/html-emails/${map.get(path).path}.html`);
					const text = await response.text();

					const mailOptions = {
						from: 'wais.cshs@gmail.com',
						to: payload.emails,
						subject: map.get(path).subject,
						html: text
					};

					const info = await transporter.sendMail(mailOptions);
					console.log(info.response);

					return new Response("Success");

				} catch (error) {
					console.log(error);
					return new Response("Invalid Json");
				}
			} else {
				return new Response("Needs application json format");
			}
		} else {
			return new Response("Invalid Path");
		}

	},
};
