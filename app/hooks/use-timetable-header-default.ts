import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "~/store/store";
import { groupsSelector } from "~/store/groups/groups-slice";
import { teachersSelector } from "~/store/teachers/teachers-slice";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { auditoriesSelector } from "~/store/auditories/auditories-slise";
import { generalSelector, setTimetableData } from "~/store/general/general-slice";

interface IListItem {
  id: number;
  name: string;
}

const useTimetableHeaderDefault = () => {
  const dispatch = useAppDispatch();

  const {
    timetable: { item, category, type },
  } = useSelector(generalSelector);

  const { groupCategories } = useSelector(groupsSelector);
  const { teachersCategories } = useSelector(teachersSelector);
  const { auditoriCategories } = useSelector(auditoriesSelector);

  let itemsList: IListItem[] = [];
  let categoriesList: IListItem[] = [];

  // if data does not exist in cookies
  if (!type || !category || !item) {
    if (groupCategories) {
      const defaultTimetableData = {
        type: "group",
        item: groupCategories[0].groups[0].id,
        category: groupCategories[0].id,
      };
      dispatch(setTimetableData(defaultTimetableData));

      categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }));
      itemsList = groupCategories[0].groups.map((el) => ({ id: el.id, name: el.name }));
      // setSlectedGroupId(groupCategories[0].groups[0]?.id);
      // setSlectedGroupId(groupCategories[0].groups[0]?.id);
      // setSlectedGroupId(groupCategories[0].groups[0]?.id);
      // setSlectedGroupId(groupCategories[0].groups[0]?.id);
    }
  }

  // if data exist in cookies
  if (type === "group" && groupCategories) {
    categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }));

    const selectedCategory = groupCategories.find((el) => el.id === category);

    if (selectedCategory) {
      itemsList = selectedCategory.groups.map((el) => ({ id: el.id, name: el.name }));
    }
  }
  //
  else if (type === "teacher" && teachersCategories) {
    categoriesList = teachersCategories.map((el) => ({ id: el.id, name: el.name }));

    const selectedCategory = teachersCategories.find((el) => el.id === category);

    if (selectedCategory) {
      itemsList = selectedCategory.teachers.map((el) => ({ id: el.id, name: getTeacherFullname(el, "short") }));
    }
  }
  //
  else if (type === "auditory" && auditoriCategories) {
    categoriesList = auditoriCategories.map((el) => ({ id: el.id, name: el.name }));

    const selectedCategory = auditoriCategories.find((el) => el.id === category);

    if (selectedCategory) {
      itemsList = selectedCategory.auditories.map((el) => ({ id: el.id, name: el.name }));
    }
  }

  return { categoriesList, itemsList };
};

export { useTimetableHeaderDefault };
