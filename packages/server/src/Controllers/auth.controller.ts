import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import shortUrl, { Shorturl_temp } from "../Models/miniURL.model";
import userData, { userdata_temp } from "../Models/userdata.model";
import userprofile, { createprofile_temp } from '../Models/user.profile.model';
import utility from "../Middlewares/utility";
import { boolean } from "yup";


export default class authenticate {

    static registration = async (req: Request, res: Response): Promise<Response> => {

        try {
            let { fullname,
                email,
                mobile,
                password,
                confirm_password }: (
                    createprofile_temp &
                    {
                        password: string;
                        confirm_password: string;
                    } & Omit<createprofile_temp, 'confirmpwd'>
                ) = req.body;

            var salt: string = bcrypt.genSaltSync(10);
            var hash: string = bcrypt.hashSync(confirm_password, salt);
            const saved: (createprofile_temp & { _id: object; }) = await userprofile.create({ fullname, email, mobile, confirmpwd: hash })
            console.log(saved)

            const token: string = utility.createauthtoken(saved.fullname, saved._id.toString())

            res.cookie('accesstoken', token, {
                domain: process.env.COOKIE_DOMAIN,
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                path: '/',
                sameSite: 'strict',
                secure: true,
                // signed: true,
            });
            // return res.redirect('/user/dashboard');

            return res.status(200).json({ request: 'successfull', registration: true, message: 'Profile created successfully' })

        } catch (err) {
            console.log(err)

            return res.status(200).json({ request: 'failed', registration: false, message: 'Internal Server Error' })
        }
    }

    static emailstatus = async (req: Request, res: Response): Promise<Response> => {
        try {

            let { email }: { email: string } = req.body;
            let validemail: boolean = new RegExp(/(^[a-zA-Z0-9._-]{2,100})(@[a-zA-Z0-9\-]{2,63})(.[a-zA-Z.-]{2,63})/g).test(email)

            let status: boolean | Error = true;
            if (validemail) {
                status = await utility.checkEmail(email);
            }

            if (!status) {
                return res.status(200).json({
                    request: 'successfull',
                    availability: true,
                    message: 'all is ok'
                })
            }
            return res.status(451).json({
                request: 'successfull',
                availability: false,
                message: "This email is already in use"
            })
        } catch (error) {
            console.log(error)
            return res.status(451).json({
                request: 'failed',
                availability: false,
                message: "Internal Server Error"
            })
        }
    }

    static login = async (req: Request, res: Response): Promise<Response> => {

        try {


            let { email, password }: ({ password: string; email: string; }) = req.body;
            console.log(email, password);
            const user: (createprofile_temp & { _id: object; } & Omit<createprofile_temp, 'email' | 'mobile'>) | null = await userprofile.findOne({ email }).select('fullname confirmpwd');
            console.log(user, '....')

            if (user) {
                const pwValidate: boolean = bcrypt.compareSync(password, user.confirmpwd);

                if (pwValidate) {
                    const token: string = utility.createauthtoken(user.fullname, user._id.toString())
                    res.cookie('accesstoken', token, {
                        domain: process.env.COOKIE_DOMAIN,
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        path: '/',
                        sameSite: 'strict',
                        secure: true,
                        // signed: true,
                    });
                    // return res.redirect('/user/dashboard');
                    return res.status(200).json({ request: 'successfull', authentication: true, message: 'credentials authenticated successfully' })

                } else {
                    res.cookie('accesstoken', '', {
                        domain: process.env.COOKIE_DOMAIN,
                        maxAge: 1000,
                        httpOnly: true,
                        path: '/',
                        sameSite: 'strict',
                        secure: true,
                        // signed: true,
                    });
                    return res.status(401).json({ request: 'successfull', authentication: false, message: 'Please verify your credentials' })
                }
            } else {
                res.cookie('accesstoken', '', {
                    domain: process.env.COOKIE_DOMAIN,
                    maxAge: 1000,
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    secure: true,
                    // signed: true,
                });
                return res.status(401).json({ request: 'successfull', authentication: false, message: 'Please verify your credentials' })
            }

        } catch (error) {
            console.log(error)
            return res.status(401).json({ request: 'failed', authentication: false, message: 'Internal Server Error' })
        }



    }

}