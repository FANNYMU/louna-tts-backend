import express, { Express } from "express";

export default class Webserver {
	app: Express = express();
	constructor() {

	}

	createRoute(path: string) {
		return this.app.route(path);
	}

	serve(port: string) {
		this.app.listen(port, (err?: Error) => {
			if (err != undefined) {
				console.log(err);
			}

			console.log(`It's Listening on ${port}`);
		});
	}
}

const webserver: Webserver = new Webserver();
export { webserver };
