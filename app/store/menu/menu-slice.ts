import { createSlice } from "@reduxjs/toolkit";

import { type RootState } from "../store";

const persist = {
  global: {
    drawerOpen: false,
    expandedNavGroups: ["/groups", "/plans"],
  },
  auth: {
    login: "aaa.aaa",
    email: "aaa@mail.com",
    avatar: "https://api.com/asdsdwdqw",
  },
  groups: {
    status: "all",
    categories: ["sadidjq83enfew", "dsofoi3fmrjngjn", "sadidjq83enfew", "dsofoi3fmrjngjn"],
    orderField: "",
    orderType: "",
  },
  teachers: {
    status: "all",
    categories: ["sadidjq83enfew", "dsofoi3fmrjngjn", "sadidjq83enfew", "dsofoi3fmrjngjn"],
    orderField: "",
    orderType: "",
  },
  auditories: {
    status: "all",
    categories: ["sadidjq83enfew", "dsofoi3fmrjngjn", "sadidjq83enfew", "dsofoi3fmrjngjn"],
    orderField: "",
    orderType: "",
  },
  plans: {},
  scheduleLessons: {},
  groupLoadLessons: {},
};

const initialState = {
  openItem: ["dashboard"],
  // defaultId: 'dashboard',
  // openComponent: 'buttons',
  drawerOpen: false,
  // componentDrawerOpen: true,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    // activeComponent(state, action) {
    //   state.openComponent = action.payload.openComponent
    // },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    // openComponentDrawer(state, action) {
    //   state.componentDrawerOpen = action.payload.componentDrawerOpen
    // },
  },
});

export const menuSelector = (state: RootState) => state.menu;

export default menuSlice.reducer;

export const { activeItem, /* activeComponent, */ openDrawer } = menuSlice.actions;
// export const { activeItem, activeComponent, openDrawer, openComponentDrawer } = menuSlice.actions
