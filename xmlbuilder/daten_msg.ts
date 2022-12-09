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
    "ns2:ConsumptionRecord": {
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xmlns:cp":
        "http://www.ebutilities.at/schemata/customerprocesses/consumptionrecord/01p30",
      "@xmlns:ct":
        "http://www.ebutilities.at/schemata/customerprocesses/common/types/01p20",
      "@xsi:schemaLocation":
        "http://www.ebutilities.at/schemata/customerprocesses/consumptionrecord/01p30 ConsumptionRecord_01p30.xsd",
      "ns2:MarketParticipantDirectory": {
        "@DocumentMode": "PROD",
        "@Duplicate": "true",
        "@SchemaVersion": "01.30",
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
        "ns2:MessageCode": "DATEN_CRMSG",
      },
      "ns2:ProcessDirectory": {
        "ct:MessageId": messageId,
        "ct:ConversationId": conversationId,
        "ns2:ProcessDate": processDate,
        "ns2:MeteringPoint": meteringPoint,
        "ns2:Energy": energydata.map((e) => ({
          "ns2:MeteringReason": e.MeteringReason,
          "ns2:MeteringPeriodStart": e.MeteringPeriodStart,
          "ns2:MeteringPeriodEnd": e.MeteringPeriodEnd,
          "ns2:MeteringIntervall": e.MeteringIntervall,
          "ns2:NumberOfMeteringIntervall": e.data.length,
          "ns2:EnergyData": {
            "@MeterCode": e.MeterCode,
            "@UOM": "KWH",
            "ns2:EP": e.data.map((d) => ({
              "ns2:DTF": d.DTF,
              "ns2:DTT": d.DTT,
              "ns2:MM": d.MM,
              "ns2:BQ": d.BQ,
            })),
          },
        })),
      },
    },
  };
  return { xml: create(payload).end({ prettyPrint: true }) };
};
