import { v4 } from "uuid";

import fs from "fs";
export const generateId = () => {
  return v4().split("-").join("");
};
export const formatDate = function (date: Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export function subtractMonths(numOfMonths: number, date = new Date()) {
  date.setMonth(date.getMonth() - numOfMonths);

  return date;
}

export const writeFile = (path: string, file: string) => {
  return new Promise((res, rej) => {
    fs.writeFile(path, file, (err) => {
      if (err) return rej(err);
      res("Done");
    });
  });
};
