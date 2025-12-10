export interface Event {
  id?: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  artist: string;
  description: string;
  emoji: string;
  freeEntry: boolean;
  reservationRequired: boolean;
}