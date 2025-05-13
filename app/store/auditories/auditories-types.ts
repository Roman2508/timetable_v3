import { LoadingStatusTypes } from "../app-types";

export type AuditoriesInitialState = {
  auditoriCategories: AuditoryCategoriesTypes[] | null;
  loadingStatus: LoadingStatusTypes;
};

export type AuditoryCategoriesTypes = {
  id: number;
  name: string;
  auditories: AuditoriesTypes[];
};

export type AuditoriesTypes = {
  id: number;
  name: string;
  seatsNumber: number;
  category: { id: number; name: string };
};
