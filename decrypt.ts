import fs, { write } from "fs";
import { createGunzip } from "zlib";
import { createDecipheriv } from "crypto";
import { generateKey } from "./utils";
import path from "path";

export class Decrypt {
  public static decrypt(file: string, password: string) {
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
      "files",
      `${file.split(".")[0]}_decrypted.${file.split(".")[1]}`
    );

    const readIvStream = fs.createReadStream(inputFilePath, { end: 15 });
    const writeStream = fs.createWriteStream(outputFilePath);

    let initIV: Buffer;

    readIvStream.on("data", (chunk: Buffer) => {
      initIV = chunk;
    });

    readIvStream.on("close", () => {
      const readFileStram = fs.createReadStream(inputFilePath, { start: 16 });
      const key = generateKey(password);
      const decipher = createDecipheriv("aes256", key, initIV);
      const zLibStream = createGunzip();

      readFileStram.pipe(decipher).pipe(zLibStream).pipe(writeStream);

      readFileStram.on("error", (err) => {
        console.error(err);
        writeStream.end();
      });

      readFileStram.on("end", () => {
        console.log("File Decrypted successfully!");
        writeStream.end();
      });
    });
  }
}
