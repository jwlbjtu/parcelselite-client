export interface TrackingInfo {
  carrier: string;
  tracking: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  event: string;
}
