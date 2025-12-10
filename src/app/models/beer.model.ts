export interface Beer {
  id?: number;
  name: string;
  price: number;
  description: string;
  type: BeerType;
  country?: string;
  alcoholPercentage?: number;
  available: boolean;
}

export enum BeerType {
  TAP = 'TAP',
  BOTTLED = 'BOTTLED'
}