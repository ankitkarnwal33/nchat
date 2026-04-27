import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

/**
 * 32-byte key, base64-encoded
 * Generate once:
 * node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 */
const ENCRYPTION_KEY = process.env.ACCESS_TOKEN_ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  if (!ENCRYPTION_KEY) {
    throw new Error("ACCESS_TOKEN_ENCRYPTION_KEY is not set");
  }

  const key = Buffer.from(ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("ACCESS_TOKEN_ENCRYPTION_KEY must decode to 32 bytes");
  }

  return key;
}

export function encryptAccessToken(plainToken: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainToken, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptAccessToken(encryptedToken: string): string {
  const key = getKey();
  const [ivB64, tagB64, dataB64] = encryptedToken.split(":");

  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Invalid encrypted token format");
  }

  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(dataB64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

console.log(
  decryptAccessToken(
    "QYMT7TD0/gYcNuJ1:CUMytys0CN+iD0G9feZJqQ==:Af8FXW2zjNBYP9UKKroYWl3ijdtAFxJR+ikIQvBxFbx+ggvdw61UOTIYrJ/VUNhs8/TVRNnrINnWRvDgFn6Vpf+kT3ug1qvKuR7vAfKk8miKoowpv7cHq3cPPLs/o6XCzF6tnv/GlDwQEjQLvipvmsgJKrt2woB5NHatWN4nGT628nvQI3J6otDCXjhAFPwjc6cjKKhOE2eriNdopqNVn1vRpfy5Ofs=",
  ),
);
