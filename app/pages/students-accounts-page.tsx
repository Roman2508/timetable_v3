import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRightFromLine, Download, GraduationCap, MessageCircleQuestion, Repeat2 } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { groupsSelector } from "~/store/groups/groups-slice";
import { InputSearch } from "~/components/ui/custom/input-search";
import { clearStudents, studentsSelector } from "~/store/students/students-slice";
import type { StudentType } from "~/store/students/students-types";
import type { GroupsShortType } from "~/store/groups/groups-types";
import { RootContainer } from "~/components/layouts/root-container";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import SelectGroupModal from "~/components/features/select-group/select-group-modal";
import { StudentsAccountsTable } from "~/components/features/pages/students-accounts/students-accounts-table";
import { getGroupCategories } from "~/store/groups/groups-async-actions";
import { getStudentsByGroupId } from "~/store/students/students-async-actions";
import EntityHeader from "~/components/features/entity-header";

const StudentsAccountsPage = () => {
  const dispatch = useAppDispatch();

  const { groupCategories } = useSelector(groupsSelector);
  const { students, loadingStatus } = useSelector(studentsSelector);

  const [deleteMode, setDeleteMode] = useState(false);
  const [helperModalVisible, setHelperModalVisible] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "update">("create");
  const [studentsIdsToDelete, setStudentsIdsToDelete] = useState<number[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null);

  const handleAddStudentToDelete = (id: number) => {
    setStudentsIdsToDelete((prev) => {
      if (prev.includes(id)) {
        return prev.filter((studentId) => studentId !== id);
      }

      return [...prev, id];
    });
  };

  useEffect(() => {
    if (groupCategories) return;
    dispatch(getGroupCategories());
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    dispatch(getStudentsByGroupId(selectedGroup.id));

    return () => {
      dispatch(clearStudents());
    };
  }, [selectedGroup]);

  return (
    <RootContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="">
          {selectedGroup ? (
            <EntityHeader label="ГРУПА" name={selectedGroup.name} status={selectedGroup.status} Icon={GraduationCap} />
          ) : (
            <div className="flex items-center h-[56px]">
              <h2 className="text-lg font-semibold">Виберіть групу для перегляду студентів</h2>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <MessageCircleQuestion />
          </Button>

          <Button variant="outline">
            <ArrowRightFromLine className="rotate-270" />
          </Button>

          <Button variant="outline">
            <Download />
          </Button>

          <Button variant="outline">
            <Repeat2 />
          </Button>

          <SelectGroupModal selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-4">
        <TabsList>
          <TabsTrigger value="all">Всі (12)</TabsTrigger>
          <TabsTrigger value="study">Навчається (8)</TabsTrigger>
          <TabsTrigger value="aaa">Відраховано (4)</TabsTrigger>
          <TabsTrigger value="bbb">Академ.відпустка (4)</TabsTrigger>
        </TabsList>
      </Tabs>

      <InputSearch className="w-full mb-6" placeholder="Знайти..." />

      <StudentsAccountsTable />
    </RootContainer>
  );
};

export default StudentsAccountsPage;
