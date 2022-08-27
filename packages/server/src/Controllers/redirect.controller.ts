import { Request, Response } from "express";
import shortUrl, { Shorturl_temp } from "../Models/miniURL.model";
import userData, { userdata_temp } from "../Models/userdata.model";
import bcrypt from "bcryptjs";

class redirection {

    static handelRedirect = async (req: Request, res: Response): Promise<Response | void> => {
        try {


            const redirectid: string = req.params.redirectid;

            const data: { destination: string; secure: boolean; _id: string; } | null = await shortUrl.findOne({ keyword: redirectid }).select('destination secure _id');

            console.log(data)

            if (data) {

                let url = data.secure ? 'blank' : data.destination;

                interface datapass {
                    baseurl?: string;
                    security: boolean;
                    destination: string;
                    id: string;
                    ref: string;
                }
                let datapass: datapass = {
                    baseurl: process.env.LOCAL_URL,
                    security: data.secure,
                    destination: url,
                    id: redirectid,
                    ref: data._id.toString(),
                }
                return res.render('Collectanalytics', { ...datapass });
            } else {
                return res.render('LinkExpired');
            }
            
        } catch (err) {
            return res.render('LinkExpired');

        }

    }

    static redirectdatacollection = async (req: Request, res: Response): Promise<Response | void> => {
        try {


            let { pathid, refid }: userdata_temp = req.body;
            console.log(pathid, refid)

            let available: ({ _id: string, destination: string })[] = await shortUrl.find({ keyword: pathid, _id: refid }).select('destination');

            // console.log(available)

            if (available.length) {
                let saved = await userData.create<userdata_temp>({ ...req.body });
                // console.log(saved)
                return res.status(200).json({
                    request: 'successfull',
                    status: 200
                })
            } else {
                return res.status(404).json({
                    request: 'failed',
                    message: 'Not Found'
                })
            }


        } catch (error) {
            return res.status(500).json({
                request: 'failed',
                message: 'Internal Server Error'
            })
        }
    }

    static redirectpasswordvalidation = async (req: Request, res: Response): Promise<Response> => {
        try {


            let { securecode,
                pathid,
                refid }: {
                    securecode: string;
                    pathid: string;
                    refid: string;
                } = req.body;


            const data: (Shorturl_temp & {
                _id: string;
            }) | null = await shortUrl.findOne({ keyword: pathid, _id: refid }).select('password destination')
            console.log(data)

            if (data) {
                const validation: boolean = bcrypt.compareSync(securecode, data.password);
                console.log(validation)
                if (validation) {
                    return res.status(200).json({
                        authentication: 'successfull',
                        destination: data.destination
                    })
                } else {
                    return res.status(401).json({
                        authentication: 'failed',

                    })
                }

            } else {
                return res.status(401).json({
                    authentication: 'failed',
                    message: 'This url is invalid'
                })

            }


        } catch (error) {
            return res.status(500).json({
                authentication: 'failed',
                message: 'Internal Server Error'
            })
        }


    }

}
export default redirection;

