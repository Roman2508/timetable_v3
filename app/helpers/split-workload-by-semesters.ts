import type { GroupLoadType } from "~/store/groups/groups-types";

const splitWorkloadBySemesters = (load: GroupLoadType[]) => {
  const firstSemesterLessons: GroupLoadType[] = [];
  const secondSemesterLessons: GroupLoadType[] = [];

  load.forEach((el) => {
    if (el.semester === 1 || el.semester === 3 || el.semester === 5) {
      firstSemesterLessons.push(el);
    }
    if (el.semester === 2 || el.semester === 4 || el.semester === 6) {
      secondSemesterLessons.push(el);
    }
  });

  return { firstSemesterLessons, secondSemesterLessons };
};

export default splitWorkloadBySemesters;
