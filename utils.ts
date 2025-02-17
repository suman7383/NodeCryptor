const crypto = require("crypto");

export const generateKey = (password: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest();
};
