import { Express, Request, Response } from "express";
import buildMiniUrl from './miniurl.build'
import redirection from "../Controllers/redirect.controller";
import urlredirect from './url.redirect'



const routes = (app: Express): void => {

    app.get('/checkup', (req: Request, res: Response): Response => {
        return res.send('App is Healthy')
    })

    app.get('/favicon.ico', (req: Request, res: Response): Response => {
        return res.send('App is Healthy')
    })

    app.get('/:redirectid', redirection.handelRedirect)

    app.use('/url', buildMiniUrl)

    app.use('/redirect', urlredirect)



    app.all('*', (req: Request, res: Response): Response => {
        return res.status(200).json({ message: 'You Dont Have Enough Permission to Access :)' })
    })

}

export default routes;