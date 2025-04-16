import busboy from "busboy";
import { NextFunction, Request, Response } from "express";
//         if (!user) {
// Middleware to handle multipart/form-data
export const fileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
    const busboyMid = busboy({ headers: req.headers });
    const buffers: Buffer[] = [];
    busboyMid.on("file", (fieldname: string, file: any) => {
      file.on("data", (data: Buffer) => {
        buffers.push(data);
      });
    });
    busboyMid.on("finish", () => {
      req.body.file = Buffer.concat(buffers);
      next();
    });
    busboyMid.on("error", (error: any) => {
      console.error("Error parsing multipart/form-data:", error);
      res.status(400).send({ error: "Invalid multipart/form-data" });
    });
    req.pipe(busboyMid);
  } else {
    next();
  }
};
