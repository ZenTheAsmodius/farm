import { GeoLocationClientError, NotAuthorized, NotFound, UnprocessableEntityError } from "errors/errors";
import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(error: Error, _: Request, res: Response, next: NextFunction): void {
  const { message } = error;

  if (error instanceof UnprocessableEntityError) {
    res.status(422).send({ name: "UnprocessableEntityError", message });
  }
  else if(error instanceof GeoLocationClientError) {
    res.status(422).send({ name: "GeoLocationClientError", message });
  }
  else if (error instanceof NotAuthorized) {
    res.status(401).send({ name: "NotAuthorized", message });
  }
  else if (error instanceof NotFound) {
    res.status(404).send({ name: "NotFound", message });
  }
  else {
    res.status(500).send({ message: "Internal Server Error" });
  }

  next();
}
