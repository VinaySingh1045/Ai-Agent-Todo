import { Application, Request, Response, Router } from "express";
import todo  from './todo'
const registerRoutes = (app: Application) => {
	const router: Router = Router();
    // Define routes here...
    router.use(todo)
	router.use("/*", (req: Request, res: Response) => {
		res.status(404).send("Not found");
	});
	app.use("/api", router);
};

export default registerRoutes;
