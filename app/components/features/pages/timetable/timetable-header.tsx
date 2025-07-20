import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useState, type Dispatch, type SetStateAction, type FC, useCallback } from "react";

import {
  TIMETABLE_ITEM,
  TIMETABLE_TYPE,
  TIMETABLE_WEEK,
  TIMETABLE_CATEGORY,
  TIMETABLE_SEMESTER,
} from "~/constants/cookies-keys";
import { useAppDispatch } from "~/store/store";
import { groupsSelector } from "~/store/groups/groups-slice";
import type { ISelectedLesson } from "~/pages/timetable-page";
import { teachersSelector } from "~/store/teachers/teachers-slice";
import DropdownSelect from "~/components/ui/custom/dropdown-select";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { auditoriesSelector } from "~/store/auditories/auditories-slise";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { useTimetableHeaderDefault } from "~/hooks/use-timetable-header-default";
import { generalSelector, setTimetableData } from "~/store/general/general-slice";
import { clearTeacherLessons } from "~/store/schedule-lessons/schedule-lessons-slice";

const semesters = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
];

interface IListItem {
  id: number;
  name: string;
}

interface ITimetableHeaderProps {
  weeksCount: number;
  setSlectedGroupId: Dispatch<SetStateAction<number | null>>;
  setSelectedLesson: Dispatch<SetStateAction<ISelectedLesson | null>>;
}

const TimetableHeader: FC<ITimetableHeaderProps> = ({ weeksCount, setSelectedLesson, setSlectedGroupId }) => {
  const dispatch = useAppDispatch();

  const [_, setCookie] = useCookies();

  const {
    timetable: { semester, week, item, category, type },
  } = useSelector(generalSelector);

  const { groupCategories } = useSelector(groupsSelector);
  const { teachersCategories } = useSelector(teachersSelector);
  const { auditoriCategories } = useSelector(auditoriesSelector);

  const { itemsList: defaultItemsList, categoriesList: defaultCategoriesList } = useTimetableHeaderDefault({
    setSlectedGroupId,
  });
  const [itemsList, setItemsList] = useState<IListItem[]>(defaultItemsList);
  const [categoriesList, setCategoriesList] = useState<IListItem[]>(defaultCategoriesList);

  const weeksList = useCallback(() => {
    const weeks: { id: number; name: string }[] = [];
    for (let i = 0; i < weeksCount; i++) {
      weeks.push({ id: Number(i + 1), name: String(i + 1) });
    }
    return weeks;
  }, [weeksCount]);

  const onCategoryChange = (categoryId: number) => {
    dispatch(clearTeacherLessons());

    if (type === "group" && groupCategories) {
      const groupsCategory = groupCategories.find((el) => el.id === categoryId);
      if (!groupsCategory) return;
      const itemsList = groupsCategory.groups.map((el) => ({ id: el.id, name: el.name }));
      setItemsList(itemsList);
      setSlectedGroupId(groupsCategory.groups[0].id || null);
      dispatch(setTimetableData({ type: "group", item: itemsList[0]?.id, category: categoryId || groupsCategory.id }));
      setCookie(TIMETABLE_ITEM, itemsList[0]?.id);
      setCookie(TIMETABLE_CATEGORY, categoryId || groupsCategory.id);
      return;
    }

    if (type === "teacher" && teachersCategories) {
      const teachersCategory = teachersCategories.find((el) => el.id === categoryId);
      if (!teachersCategory) return;
      const itemsList = teachersCategory.teachers.map((el) => ({ id: el.id, name: getTeacherFullname(el, "short") }));
      console.log("itemsList", itemsList, "teachersCategory.teachers", teachersCategory.teachers);
      setItemsList(itemsList);
      dispatch(
        setTimetableData({ type: "teacher", item: itemsList[0]?.id, category: categoryId || teachersCategory.id }),
      );
      setCookie(TIMETABLE_ITEM, itemsList[0]?.id);
      setCookie(TIMETABLE_CATEGORY, categoryId || teachersCategory.id);
      return;
    }

    if (type === "auditory" && auditoriCategories) {
      const auditoriCategory = auditoriCategories.find((el) => el.id === categoryId);
      if (!auditoriCategory) return;
      const itemsList = auditoriCategory.auditories.map((el) => ({ id: el.id, name: el.name }));
      setItemsList(itemsList);
      dispatch(
        setTimetableData({ type: "auditory", item: itemsList[0]?.id, category: categoryId || auditoriCategory.id }),
      );
      setCookie(TIMETABLE_ITEM, itemsList[0]?.id);
      setCookie(TIMETABLE_CATEGORY, categoryId || auditoriCategory.id);
    }
  };

  const onTabChange = (type: string) => {
    if (!groupCategories || !teachersCategories || !auditoriCategories) return;

    let item = null;
    let category = null;

    if (type === "group") {
      const categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }));
      setCategoriesList(categoriesList);

      const itemsList = groupCategories[0]?.groups.map((el) => ({ id: el.id, name: el.name }));
      setItemsList(itemsList);

      item = groupCategories[0].groups[0]?.id;
      category = groupCategories[0].id;
    }

    if (type === "teacher") {
      const categoriesList = teachersCategories.map((el) => ({ id: el.id, name: el.name }));
      setCategoriesList(categoriesList);

      const teachers = teachersCategories[0]?.teachers;
      const itemsList = teachers.map((el) => ({ id: el.id, name: getTeacherFullname(el, "short") }));
      setItemsList(itemsList);

      item = teachersCategories[0].teachers[0]?.id;
      category = teachersCategories[0].id;
    }

    if (type === "auditory") {
      const categoriesList = auditoriCategories.map((el) => ({ id: el.id, name: el.name }));
      setCategoriesList(categoriesList);

      const itemsList = auditoriCategories[0]?.auditories?.map((el) => ({ id: el.id, name: el.name }));
      setItemsList(itemsList);

      item = auditoriCategories[0].auditories[0]?.id;
      category = auditoriCategories[0].id;
    }

    dispatch(setTimetableData({ type, item, category }));
    setCookie(TIMETABLE_TYPE, type);
    setCookie(TIMETABLE_ITEM, item);
    setCookie(TIMETABLE_CATEGORY, category);
  };

  return (
    <div className="flex justify-between mb-4">
      <div className="flex gap-3">
        <DropdownSelect
          classNames="w-75"
          label="Категорії"
          items={categoriesList}
          onChange={(category) => {
            setCookie(TIMETABLE_CATEGORY, category);
            onCategoryChange(category);
          }}
          selectedItem={category || null}
        />

        <DropdownSelect
          classNames="w-55"
          items={itemsList}
          selectedItem={item || null}
          onChange={(item) => {
            setCookie(TIMETABLE_ITEM, item);
            dispatch(setTimetableData({ item }));
          }}
          label={type === "group" ? "Група" : type === "teacher" ? "Викладач" : type === "auditory" ? "Аудиторія" : ""}
        />

        <DropdownSelect
          classNames="w-30"
          label="Семестр"
          items={semesters}
          selectedItem={semester || null}
          onChange={(semester) => {
            setCookie(TIMETABLE_SEMESTER, semester);
            dispatch(setTimetableData({ semester }));
          }}
        />

        <DropdownSelect
          sortBy="id"
          classNames="w-30"
          label="Тиждень"
          items={weeksList()}
          selectedItem={week || null}
          onChange={(week) => {
            setCookie(TIMETABLE_WEEK, week);
            dispatch(setTimetableData({ week }));
          }}
        />
      </div>

      <Tabs defaultValue={type || "group"} onValueChange={(value) => onTabChange(value)}>
        <TabsList className="h-full">
          <TabsTrigger value="group" className="h-10">
            Групи
          </TabsTrigger>
          <TabsTrigger value="teacher" className="h-10">
            Викладачі
          </TabsTrigger>
          <TabsTrigger value="auditory" className="h-10">
            Аудиторії
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TimetableHeader;
