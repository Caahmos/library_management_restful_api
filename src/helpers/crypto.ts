import bcrypt from "bcryptjs";

export class Crypto {
  static async encrypt(saltRounds: number, password: string) {
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;
  };

  static async compare(password: string, passwordHash: string) {
    const verifiedPassword = await bcrypt.compare(password, passwordHash);

    if (!verifiedPassword) throw new Error("Usuário e/ou senha incorretos!");
    
    return verifiedPassword;
  };
};
