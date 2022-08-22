import { Express, Request, Response } from "express";

const routes = (app: Express) => {

    app.get('/checkup', (req: Request, res: Response): Response => {
        return res.send('App is Healthy')
    })

}

export default routes;