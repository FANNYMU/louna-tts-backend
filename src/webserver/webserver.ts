import { serve } from '@hono/node-server';
import { Hono } from 'hono'
export default class Webserver {
	app: Hono = new Hono();
	routes: Array<Hono> = [];
	constructor() {
	}

	createRoute(path: string) {
		const group = new Hono().basePath(path);
		this.routes.push(group);
		return group;
	}

	listen(port: number) {
		this.useRoutes();
		serve({
			fetch: this.app.fetch,
			port: port,
		}, () => {
			console.log("Listening on port:", port);
		});
	}

	private useRoutes() {
		for (const r of this.routes) {
			this.app.route("", r);
		}
	}
}

const webserver: Webserver = new Webserver();
export { webserver };
