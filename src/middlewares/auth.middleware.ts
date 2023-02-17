import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import config from "config/config";
import { UsersService } from "modules/users/users.service";
import { NotAuthorized } from "errors/errors";

interface CustomJwtPayload extends JwtPayload {
  id: string,
  email: string,
  iat: number,
  exp: number
}
export async function isAuthorized(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.headers.authorization) return next(new NotAuthorized("Authorization header is missing."));

  const token = req.headers.authorization;

  try {
    const { email } = verify(token, config.JWT_SECRET) as CustomJwtPayload;
    res.locals.user = await new UsersService().findOneBy({ email });
    return next();
  } catch (error) {
    console.log(error)
    return next(new NotAuthorized("Invalid token."));
  }
}
