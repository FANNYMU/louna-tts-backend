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
		this.useMiddlewares();
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

	private useMiddlewares() {
		this.app.use(express.json());
	}
}

const webserver: Webserver = new Webserver();
export { webserver };
