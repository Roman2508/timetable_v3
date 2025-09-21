import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type AddGroupToStreamPayloadType,
  type UpdateEntityNamePayloadType,
  type AddLessonsToStreamPayloadType,
  type DeleteGroupFromStreamPayloadType,
  type DeleteLessonFromStreamPayloadType,
} from "../../api/api-types";
import { streamsAPI } from "../../api/api";
import { LoadingStatusTypes } from "../app-types";
import { type StreamsType } from "./streams-types";
import { setLoadingStatus } from "./streams-slice";

export const getStreams = createAsyncThunk("streams/getStreams", async (_, thunkAPI): Promise<StreamsType[]> => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = streamsAPI.getStreams();

  toast.promise(promise, {
    // loading: "Завантаження...",
    // success: "Потоки завантажено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

export const createStream = createAsyncThunk("streams/createStream", async (payload: { name: string }, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = streamsAPI.createStream(payload);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Потік створено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

export const updateStream = createAsyncThunk(
  "streams/updateStream",
  async (payload: UpdateEntityNamePayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = streamsAPI.updateStreamName(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Потік оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const deleteStream = createAsyncThunk("streams/deleteStream", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = streamsAPI.deleteStream(id);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Потік видалено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

/* Stream Groups */
export const addGroupToStream = createAsyncThunk(
  "streams/addGroupToStream",
  async (payload: AddGroupToStreamPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = streamsAPI.addGroupToStream(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Групу додано до потоку",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const deleteGroupFromStream = createAsyncThunk(
  "streams/deleteGroupFromStream",
  async (payload: DeleteGroupFromStreamPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = streamsAPI.deleteGroupFromStream(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Групу видалено з потоку",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

/* Stream Lessons */

export const getStreamLessons = createAsyncThunk("streams/getStreamLessons", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = streamsAPI.getStreamLessonsByGroupId(id);

  toast.promise(promise, {
    // loading: 'Завантаження...',
    // success: 'Дисципліни завантажено',
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

export const addLessonToStream = createAsyncThunk(
  "streams/addLessonToStream",
  async (payload: AddLessonsToStreamPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = streamsAPI.addLessonToStream(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Потік оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const deleteLessonFromStream = createAsyncThunk(
  "streams/deleteLessonFromStream",
  async (payload: DeleteLessonFromStreamPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = streamsAPI.deleteLessonFromStream(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Потік оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);
