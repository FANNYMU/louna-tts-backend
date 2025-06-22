import express, { Express, IRoute, Router } from "express";

export default class Webserver {
	app: Express = express();
	routes: Array<Router> = [];
	constructor() {

	}

	createRoute() {
		const route = Router()
		this.routes.push(route);
		return route;
	}

	serve(port: string) {
		this.useRoutes();
		this.app.listen(port, (err?: Error) => {
			if (err != undefined) {
				console.log(err);
			}

			console.log(`It's Listening on ${port}`);
		});
	}

	private useRoutes() {
		for (const r of this.routes) {
			this.app.use(r);
		}
	}
}

const webserver: Webserver = new Webserver();
export { webserver };
