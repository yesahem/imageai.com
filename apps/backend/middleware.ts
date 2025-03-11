

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"]
        const token2 = authHeader?.split(" ")
        const token = authHeader?.split(" ")[1]
        console.log("tokenundefined is ", token2)
        console.log("tokenundefined is 1", token)

        if (!token || token === "null" || token === "undefined") {
            console.log("token is not present")
            res.json({
                message: "token not present"
            })
            return

        }

        const decodedToken = jwt.decode(token)?.sub
        if (decodedToken) {
            req.userId = decodedToken as string;
            next();

        }

        console.log("decodedToken", decodedToken)

        // const decodedToken = jwt.decode(token)

    } catch (error) {

        console.log("error in authMiddleWare")
        console.log(error)
    }
}