import { Request } from "express";

export interface CustomRequest<T> extends Request {
  body: T
}

export interface CustomRequestQuery<T> extends Request<{}, {}, {}, T> {
  query: T
}
