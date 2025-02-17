import { Decrypt } from "./decrypt";
import { Encrypt } from "./encrypt";

const operation = process.argv[2];
const file = process.argv[3];
const password = process.argv[4];

if (operation === "encrypt") {
  console.log(file);
  Encrypt.encrypt(file, password);
} else if (operation === "decrypt") {
  Decrypt.decrypt(file, password);
} else {
  console.error("Invalid operation");
}
