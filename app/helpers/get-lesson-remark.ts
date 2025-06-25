import type { StreamsType } from "~/store/streams/streams-types";
import type { GroupLoadStreamType } from "~/store/groups/groups-types";

interface IgetLessonRemarkProps {
  stream: GroupLoadStreamType | StreamsType | null;
  subgroupNumber: number | null;
  typeRu: "ЛК" | "ПЗ" | "ЛАБ" | "СЕМ" | "ЕКЗ" | "КОНС" | "МЕТОД";
  specialization: string | null;
}

const getLessonRemark = ({ stream, subgroupNumber, typeRu, specialization }: IgetLessonRemarkProps): string => {
  const streamName = stream ? ` ⋅ ${stream.name}` : "";
  const subgroup = subgroupNumber ? ` ⋅ п.${subgroupNumber}` : "";
  const spec = specialization ? ` ⋅ ${specialization} спец. ` : "";
  const remark = typeRu + streamName + spec + subgroup;

  return remark;
};

export { getLessonRemark };
