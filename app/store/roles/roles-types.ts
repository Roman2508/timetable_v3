import { LoadingStatusTypes } from "../app-types";

export type RolesInitialState = {
  roles: RoleType[] | null;
  loadingStatus: LoadingStatusTypes;
};

export type RoleType = {
  id: number;
  name: string;
  key: string;
};
