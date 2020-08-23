import { NextFunction, Request, RequestHandler, Response } from "express";
import stringify from "json-stable-stringify";

import { logger } from "../utils/logger";

export enum ErrorCode {
  UNKNOWN = 0,
  INVALID_USERNAME = 1,
  INVALID_PASSWORD = 2,
  ACCOUNT_BLOCKED = 3,
  PASSWORD_NOT_STRONG = 4,
  INVALID_DATA = 10,
}

export class AppError extends Error {
  public errorCode: ErrorCode;

  constructor(message: string, errorCode: ErrorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}

export function handleErrors(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((err: Error | AppError) => {
      logger.error(err.message);
      logger.error(JSON.stringify(err.stack));
      res.setHeader("Content-Type", "application/json");
      res.status(500).send(
        stringify({
          errorCode: err instanceof AppError ? err.errorCode : ErrorCode.UNKNOWN,
          message: err.message,
        }),
      );
    });
  };
}