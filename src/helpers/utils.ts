import { DataSource } from "typeorm";
import fs from "fs";
import path from "path";

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};

export const convertStringToNumberInArray = (arr: Array<string>): Array<string | number> => {
  return arr.map(el => {
    const a = Number(el);
    return Number.isNaN(a) ? el : a;
  })
};

export const getCsvFromFilesFolder = (): string[]=>{
  const pathToFiles = "files/";
  return fs.readdirSync(pathToFiles).filter((file) => path.extname(file) === ".csv");
};

export const containsNumber = (text:string): boolean=>{
  return /\d/.test(text);
};
