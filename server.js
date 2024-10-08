const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 88;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log("> Not Ready on http://localhost:" + port);
console.log(process.env.NODE_ENV);

app
	.prepare()
	.then(() => {
		const server = express();

		server.get("/p/:id", (req, res) => {
			const actualPage = "/post";
			const queryParams = { title: req.params.id };
			app.render(req, res, actualPage, queryParams);
		});

		server.get("*", (req, res) => {
			return handle(req, res);
		});

		server.listen(port, (err) => {
			if (err) throw err;
			console.log("> Ready on http://localhost:" + port);
		});
	})
	.catch((ex) => {
		console.error(ex.stack);
		process.exit(1);
	});
