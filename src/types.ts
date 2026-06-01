export type ScreenType =
  | 'beginning'
  | 'dying-earth'
  | 'ark-project'
  | 'journey'
  | 'last-signal'
  | 'the-future';

export interface SignalMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}
