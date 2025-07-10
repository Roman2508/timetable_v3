import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronsUpDown, CircleX, CopyX, GraduationCap, UserMinus, UserPlus } from "lucide-react";

import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import SelectGroupModal from "~/components/features/select-group/select-group-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";
import type { GroupLoadType, GroupsShortType } from "~/store/groups/groups-types";
import { useAppDispatch } from "~/store/store";
import { groupsSelector } from "~/store/groups/groups-slice";
import { scheduleLessonsSelector } from "~/store/schedule-lessons/schedule-lessons-slice";
import {
  addStudentToLesson,
  deleteStudentFromLesson,
  addStudentsToAllGroupLessons,
  deleteStudentsFromAllGroupLessons,
} from "~/store/schedule-lessons/schedule-lessons-async-actions";
import DropdownSelect from "~/components/ui/custom/dropdown-select";

const semestersList = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
  { id: 8, name: "8" },
];

const lessonsTabs = [
  {
    icon: <CopyX />,
    label: "Одна дисципліна",
    name: "one",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
  {
    icon: <CircleX />,
    label: "Всі дисципліни",
    name: "all",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
];

const StudentsDividePage = () => {
  const dispatch = useAppDispatch();

  const { group } = useSelector(groupsSelector);
  const { lessonStudents, loadingStatus } = useSelector(scheduleLessonsSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [studentsToAdd, setStudentsToAdd] = useState<string[]>([]);
  const [openedLessonsIds, setOpenedLessonsIds] = useState<string[]>([]);
  const [studentsToDelete, setStudentsToDelete] = useState<string[]>([]);
  const [dividingType, setDividingType] = useState<"all" | "one">("all");
  const [selectedLesson, setSelectedLesson] = useState<GroupLoadType | null>(null);
  const [isActionButtonsDisabled, setIsActionButtonsDisabled] = useState({ add: false, delete: false });

  const [activeLesson, setActiveLesson] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number>();
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null);

  const selectedLessonText = selectedLesson
    ? `${selectedLesson.typeRu}. ${selectedLesson.name} ${
        selectedLesson.subgroupNumber ? `(підгрупа ${selectedLesson.subgroupNumber})` : "(вся група)"
      }`
    : "";

  const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>, type: "add" | "delete") => {
    const { options } = event.target;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    if (type === "add") setStudentsToAdd(value);
    if (type === "delete") setStudentsToDelete(value);
  };

  const onAddStudentsToLesson = async () => {
    try {
      if (!selectedLesson) return alert("Виберіть дисципліну");
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: true }));
      const studentIds = studentsToAdd.map((el) => Number(el));
      await dispatch(addStudentToLesson({ lessonId: selectedLesson.id, studentIds }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: false }));
    }
  };

  const onDeleteStudentsFromLesson = async () => {
    try {
      if (!selectedLesson) return alert("Виберіть дисципліну");
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: true }));
      const studentIds = studentsToDelete.map((el) => Number(el));
      await dispatch(deleteStudentFromLesson({ lessonId: selectedLesson.id, studentIds }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: false }));
    }
  };

  const onAddStudentsToAllGroupLessons = async () => {
    try {
      if (!selectedGroup || !selectedSemester) return alert("Виберіть групу та семестр");
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: true }));
      const studentIds = studentsToAdd.map((el) => Number(el));
      const payload = { groupId: selectedGroup.id, semester: selectedSemester, studentIds };
      await dispatch(addStudentsToAllGroupLessons(payload));
    } catch (error) {
      console.log(error);
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: false }));
    }
  };

  const onDeleteStudentsFromAllGroupLessons = async () => {
    try {
      if (!selectedGroup || !selectedSemester) return alert("Виберіть групу та семестр");
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: true }));
      const studentIds = studentsToDelete.map((el) => Number(el));
      await dispatch(
        deleteStudentsFromAllGroupLessons({ groupId: selectedGroup.id, semester: selectedSemester, studentIds }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <RootContainer classNames="max-h-[calc(100vh-160px)] overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="">
          {true ? (
            <div className="flex flex-col h-[56px]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 text-black/40" />
                <div className="text-black/40 text-sm">ГРУПА</div>
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">PH9-25-1</h2>
                <Badge variant="outline" className="text-primary bg-primary-light border-0">
                  Активна
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center h-[56px]">
              <h2 className="text-lg font-semibold">Виберіть групу для розподілу студентів</h2>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <SelectGroupModal selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />

          <DropdownSelect
            classNames="w-40 bg-primary"
            items={semestersList}
            label="Вибрати семестр"
            selectedItem={selectedSemester}
            onChange={(item) => setSelectedSemester(item)}
          />
        </div>
      </div>

      <div className="flex w-full gap-3 !h-[calc(100vh-240px)]">
        <Card className="p-3 pr-0 flex-1">
          <h3 className="font-semibold">Студенти групи PH9-25-1</h3>

          <select multiple className="h-full border-0 outline-0">
            {[...Array(30)].map((_, index) => (
              <option value={index} className="p-1 text-sm">
                {index + 1}. Test Student Name{index}
              </option>
            ))}
          </select>
        </Card>

        <div className="flex-1">
          <Card className="mb-3 p-0 gap-0 flex-row items-center h-10">
            <Tooltip delayDuration={500}>
              <TooltipTrigger className="flex-1">
                <Button variant="ghost" className="w-full">
                  <UserPlus />
                  Зарахувати
                </Button>
              </TooltipTrigger>
              <TooltipContent>Зарахувати вибраних студентів на дисципліну</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger className="flex-1">
                <Button variant="ghost" className="w-full">
                  <UserMinus />
                  Відрахувати
                </Button>
              </TooltipTrigger>
              <TooltipContent>Відрахувати вибраних студентів з дисципліни</TooltipContent>
            </Tooltip>
          </Card>

          <div className="flex gap-2 mb-3 w-full">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full">
                {lessonsTabs.map((el) => (
                  <TabsTrigger key={el.name} value={el.name} className="h-[40px] w-full flex-1">
                    {el.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Card className="pt-3 flex-1 h-[calc(100vh-288px)]">
            <div className="overflow-y-auto overflow-x-hidden pr-3">
              {[
                "Інформаційні технології у фармації",
                "Фармакологія",
                "Органічна хімія",
                "Ділова іноземна мова (B1)",
                "Технологія ліків",
                "Інформаційні технології у фармації",
                "Фармакологія",
                "Органічна хімія",
                "Ділова іноземна мова (B1)",
                "Технологія ліків",
                "Інформаційні технології у фармації",
                "Фармакологія",
                "Органічна хімія",
                "Ділова іноземна мова (B1)",
                "Технологія ліків",
              ].map((el) => (
                <Collapsible className="space-y-2">
                  <div className="flex items-center justify-between space-x-4 pl-4">
                    <h4 className="text-sm font-semibold">{el}</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="space-y-2 mb-4 ml-4">
                    {["ЛК", "ПЗ", "СЕМ", "ЕКЗ"].map((lessonType) => (
                      <div
                        className={cn(
                          "border px-4 py-2 font-mono text-sm cursor-pointer",
                          `${el}_${lessonType}` === activeLesson ? "border-primary text-primary" : "",
                        )}
                        onClick={() => setActiveLesson(`${el}_${lessonType}`)}
                      >
                        {lessonType} (вся група)
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-3 pr-0 flex-1">
          <h3 className="font-semibold">Інформаційні технології у фармації</h3>

          <select multiple className="h-full border-0 outline-0">
            {[...Array(30)].map((_, index) => (
              <option value={index} className="p-1 text-sm">
                {index + 1}. Abcdefghijklmnstorvwzyz{index}
              </option>
            ))}
          </select>
        </Card>
      </div>
    </RootContainer>
  );
};

export default StudentsDividePage;
