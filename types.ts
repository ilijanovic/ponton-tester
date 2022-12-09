export type DatapointT = {
  DTF: string;
  DTT: string;
  MM: string;
  BQ: number;
};

export type EnergyDataT = {
  MeteringReason: string;
  MeteringPeriodStart: string;
  MeteringPeriodEnd: string;
  MeteringIntervall: string;
  NumberOfMeteringIntervall: number;
  MeterCode: string;
  data: DatapointT[];
};
