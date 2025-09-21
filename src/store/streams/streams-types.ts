import { LoadingStatusTypes } from "../app-types";
import { type GroupLoadType } from "../groups/groups-types";

export type StreamsInitialState = {
  streams: StreamsType[] | null;
  streamLessons: null | GroupLoadType[];
  loadingStatus: LoadingStatusTypes;
};

export type StreamsType = {
  id: number;
  name: string;
  groups: { id: number; name: string }[];
  lessons: { id: number; name: string }[];
};
