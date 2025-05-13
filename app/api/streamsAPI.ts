import {
  AddGroupToStreamPayloadType,
  UpdateEntityNamePayloadType,
  AddLessonsToStreamPayloadType,
  DeleteGroupFromStreamPayloadType,
  DeleteGroupFromStreamResponseType,
  DeleteLessonFromStreamPayloadType,
} from "./apiTypes";
import { instanse } from "./api";
import { GroupLoadType } from "../store/groups/groups-types";
import { StreamsType } from "../store/streams/streams-types";

export const streamsAPI = {
  getStreams() {
    return instanse.get<StreamsType[]>("/streams");
  },
  createStream(payload: { name: string }) {
    return instanse.post<StreamsType>("/streams", payload);
  },
  updateStreamName(payload: UpdateEntityNamePayloadType) {
    const { id, name } = payload;
    return instanse.patch<StreamsType>(`/streams/name/${id}`, { name });
  },
  deleteStream(id: number) {
    return instanse.delete<number>(`/streams/${id}`);
  },

  /* groups (add or delete) */
  addGroupToStream(payload: AddGroupToStreamPayloadType) {
    const { groupId, streamId } = payload;
    return instanse.patch<StreamsType>(`/streams/group/add/${streamId}`, { groupId });
  },
  deleteGroupFromStream(payload: DeleteGroupFromStreamPayloadType) {
    const { groupId, streamId } = payload;
    return instanse.delete<DeleteGroupFromStreamResponseType>(`/streams/group/remove/${streamId}/${groupId}`);
  },

  /* lessons (get, add or delete)  */
  getStreamLessonsByGroupId(id: number) {
    return instanse.get<GroupLoadType[]>(`/group-load-lessons/${id}`);
  },

  addLessonToStream(payload: AddLessonsToStreamPayloadType) {
    return instanse.patch<GroupLoadType[]>(`/streams/lesson/add/${payload.streamId}`, payload);
  },
  deleteLessonFromStream(payload: DeleteLessonFromStreamPayloadType) {
    return instanse.patch<GroupLoadType[]>(`/streams/lesson/remove`, payload);
  },
};
