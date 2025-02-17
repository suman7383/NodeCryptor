import fs from "fs";
import path from "path";
import { createGzip } from "zlib";
const crypto = require("crypto");
import { createCipheriv } from "crypto";
import { generateKey } from "./utils";
import { Transform, TransformCallback } from "stream";

class InsertIV extends Transform {
  isAppended: boolean;
  initVector: Buffer;

  constructor(initVector: Buffer, opts = {}) {
    super(opts);
    this.initVector = initVector;
    this.isAppended = false;
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    cb: TransformCallback
  ): void {
    if (!this.isAppended) {
      this.push(this.initVector);
      this.isAppended = true;
    }

    this.push(chunk);
    cb();
  }
}

export class Encrypt {
  public static encrypt(file: string, password: string) {
    if (!file) {
      throw new Error("No file name provided");
    }
    if (!password) {
      throw new Error("No password provided");
    }

    const inputFilePath = path.join(__dirname, "..", `files`, file);
    const outputFilePath = path.join(
      __dirname,
      "..",
      `files`,
      `${file.split(".")[0]}.${file.split(".")[1]}.enc`
    );

    const readStream = fs.createReadStream(inputFilePath);
    const writeStream = fs.createWriteStream(outputFilePath);

    const key = generateKey(password);
    const initIV = crypto.randomBytes(16);
    const cipher = createCipheriv("aes256", key, initIV);
    const zLibStream = createGzip();
    const insertIv = new InsertIV(initIV);

    readStream.pipe(zLibStream).pipe(cipher).pipe(insertIv).pipe(writeStream);
    console.log("File Encrypted");
  }
}
