import { EnergyDataT } from "types";
import { create } from "xmlbuilder2";
import { generateId } from "../service/utils";

export const createDatenMsg = (
  sender: string,
  receiver: string,
  meteringPoint: string,
  energydata: EnergyDataT[]
) => {
  let messageId = generateId();
  let conversationId = generateId();
  let processDate = new Date().toISOString().split("T")[0];
  let creationTime = new Date().toISOString();

  let payload = {
    "cp:CMRequest": {
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xmlns:cp":
        "http://www.ebutilities.at/schemata/customerprocesses/consumptionrecord/01p31",
      "@xmlns:ct":
        "http://www.ebutilities.at/schemata/customerprocesses/common/types/01p20",
      "@xsi:schemaLocation":
        "http://www.ebutilities.at/schemata/customerprocesses/consumptionrecord/01p30 ConsumptionRecord_01p31.xsd",
      "cp:MarketParticipantDirectory": {
        "@DocumentMode": "PROD",
        "@Duplicate": "true",
        "@SchemaVersion": "01.31",
        "ct:RoutingHeader": {
          "ct:Sender": {
            "@AddressType": "ECNumber",
            "ct:MessageAddress": sender,
          },
          "ct:Receiver": {
            "@AddressType": "ECNumber",
            "ct:MessageAddress": receiver,
          },
          "ct:DocumentCreationDateTime": creationTime,
        },
        "ct:Sector": "01",
        "cp:MessageCode": "DATEN_CRMSG",
      },
      "cp:ProcessDirectory": {
        "ct:MessageId": messageId,
        "ct:ConversationId": conversationId,
        "cp:ProcessDate": processDate,
        "cp:MeteringPoint": meteringPoint,
        "cp:Energy": energydata.map((e) => ({
          "cp:MeteringReason": e.MeteringReason,
          "cp:MeteringPeriodStart": e.MeteringPeriodStart,
          "cp:MeteringPeriodEnd": e.MeteringPeriodEnd,
          "cp:MeteringIntervall": e.MeteringIntervall,
          "cp:NumberOfMeteringIntervall": e.data.length,
          "cp:EnergyData": {
            "@MeterCode": e.MeterCode,
            "@UOM": "KWH",
            "cp:EP": e.data.map((d) => ({
              "cp:DTF": d.DTF,
              "cp:DTT": d.DTT,
              "cp:MM": d.MM,
              "cp:BQ": d.BQ,
            })),
          },
        })),
      },
    },
  };
  return { xml: create(payload).end({ prettyPrint: true }) };
};
