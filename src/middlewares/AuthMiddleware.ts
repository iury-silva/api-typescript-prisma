import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload{
  isAuth: string,
}

class AuthMiddleware{
  auth(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    console.log("here");
    
    if(!authHeader) {
      return response.status(401).json({
        code: "token.missing",
        message: "Token missing"
      });
    }

    const [, token] = authHeader.split(" ");

    console.log(token);

    const secretKey: string | undefined = process.env.SECRET_KEY

    if(!secretKey) {
      throw new Error("There is no token key");
      
    }
  
    try {
      const { isAuth } = verify(token, secretKey) as IPayload;

      request.user_id = isAuth;
      return next();
    } catch (error) {
      return response.status(401).json({
        code: 'token.expired',
        message: 'Expired token'
      })
    }
    

  }
}

export { AuthMiddleware }