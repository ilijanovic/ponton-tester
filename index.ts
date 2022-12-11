import { EnergyDataT } from "types";
import dayjs from "dayjs";
import { createDatenMsg } from "./xmlbuilder/daten_msg";
import { writeFile } from "./service/utils";
import { config } from "./config";

let root = dayjs().startOf("day");

let energydata: EnergyDataT[] = [];
export const meterCodes = [
  "1-1:1.9.0 G.01", //consumption
  "1-1:2.9.0 G.02", //generation
  "1-1:2.9.0 G.03", //self coverage
];
function randomFromInterval(min: number, max: number) {
  // min and max included
  return (Math.random() * (max - min + 1) + min).toFixed(6);
}
meterCodes.forEach((metercode) => {
  let data = [];
  for (let i = 0; i < 96; i++) {
    let bq;
    if (metercode === "1-1:1.9.0 G.01") {
      if (i > 24 && i < 48) {
        bq = randomFromInterval(0.3, 1);
      } else if (i > 48 && i < 70) {
        bq = randomFromInterval(0.8, 1.3);
      } else {
        bq = randomFromInterval(0.1, 0.5);
      }
    }
    if (metercode === "1-1:2.9.0 G.02") {
      if (i > 24 && i < 48) {
        bq = randomFromInterval(0.3, 0.8);
      } else if (i > 48 && i < 70) {
        bq = randomFromInterval(0.8, 1.4);
      } else {
        bq = randomFromInterval(0, 0.2);
      }
    }

    if (metercode === "1-1:2.9.0 G.03") {
      bq = randomFromInterval(
        0,
        //@ts-ignore
        energydata[0]?.data[i]?.BQ >= energydata[1]?.data[i]?.BQ
          ? energydata[0]?.data[i]?.BQ
          : energydata[1]?.data[i]?.BQ
      );
    }
    data.push({
      BQ: bq,
      DTF: root.add(15 * i, "minute").format("YYYY-MM-DDTHH:mm:ss+01:00"),
      DTT: root.add(15 * (i + 1), "minute").format("YYYY-MM-DDTHH:mm:ss+01:00"),
      MM: "L1",
    });
  }
  energydata.push({
    MeterCode: metercode,
    //@ts-ignore
    data,
    MeteringIntervall: "QH",
    MeteringPeriodEnd: root.add(24, "hour").format("YYYY-MM-DDTHH:mm:ss+01:00"),
    MeteringPeriodStart: root.format("YYYY-MM-DDTHH:mm:ss+01:00"),
    MeteringReason: "00",
    NumberOfMeteringIntervall: data.length,
  });
});

let { xml } = createDatenMsg(
  "RC110117",
  "AT003000",
  "AT0030020000000000000000000000",
  energydata
);

(async () => {
  await writeFile(config.inboxFolder + "/DATEN_CRMSG.xml", xml);
})();
