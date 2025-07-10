import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Plus } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import EntityHeader from "~/components/features/entity-header";
import { clearStudents } from "~/store/students/students-slice";
import { InputSearch } from "~/components/ui/custom/input-search";
import type { GroupsShortType } from "~/store/groups/groups-types";
import { RootContainer } from "~/components/layouts/root-container";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { getStudentsByGroupId } from "~/store/students/students-async-actions";
import SelectGroupModal from "~/components/features/select-group/select-group-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import AccountsHelperModal from "~/components/features/pages/students-accounts/accounts-helper-modal";
import DeleteStudentsAccounts from "~/components/features/pages/students-accounts/delete-students-accounts";
import ImportStudentsAccounts from "~/components/features/pages/students-accounts/import-students-accounts";
import ExportStudentsAccounts from "~/components/features/pages/students-accounts/export-students-accounts";
import UpdateStudentsAccounts from "~/components/features/pages/students-accounts/update-students-accounts";
import { StudentsAccountsTable } from "~/components/features/pages/students-accounts/students-accounts-table";

const StudentsAccountsPage = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState("");
  const [helperModalOpen, setHelperModalOpen] = useState(false);
  const [studentsIdsToDelete, setStudentsIdsToDelete] = useState<number[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null);
  const [actionMode, setActionMode] = useState<"create" | "update" | "delete">("create");

  const handleAddStudentToDelete = (id: number) => {
    setStudentsIdsToDelete((prev) => {
      if (prev.includes(id)) {
        return prev.filter((studentId) => studentId !== id);
      }
      return [...prev, id];
    });
  };

  useEffect(() => {
    if (!selectedGroup) return;
    dispatch(getStudentsByGroupId(selectedGroup.id));

    return () => {
      dispatch(clearStudents());
    };
  }, [selectedGroup]);

  return (
    <>
      <AccountsHelperModal open={helperModalOpen} setOpen={setHelperModalOpen} />

      <RootContainer>
        <div className="flex justify-between items-center mb-6">
          <div className="">
            {selectedGroup ? (
              <EntityHeader
                label="ГРУПА"
                name={selectedGroup.name}
                status={selectedGroup.status}
                Icon={GraduationCap}
              />
            ) : (
              <div className="flex items-center h-[56px]">
                <h2 className="text-lg font-semibold">Виберіть групу для перегляду студентів</h2>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {selectedGroup && (
              <>
                <DeleteStudentsAccounts
                  actionMode={actionMode}
                  setActionMode={setActionMode}
                  studentsIdsToDelete={studentsIdsToDelete}
                  setStudentsIdsToDelete={setStudentsIdsToDelete}
                />
                <ImportStudentsAccounts setHelperModalOpen={setHelperModalOpen} />
                <ExportStudentsAccounts selectedGroup={selectedGroup} />
                <UpdateStudentsAccounts />

                <Tooltip delayDuration={500}>
                  <TooltipTrigger>
                    <Button variant="outline" onClick={() => navigate("/students/create")}>
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Додати нового студента до групи</TooltipContent>
                </Tooltip>
              </>
            )}

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

        <InputSearch
          value={globalFilter}
          className="w-full mb-6"
          placeholder="Знайти..."
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <StudentsAccountsTable
          actionMode={actionMode}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          studentsIdsToDelete={studentsIdsToDelete}
          setStudentsIdsToDelete={setStudentsIdsToDelete}
          handleAddStudentToDelete={handleAddStudentToDelete}
        />
      </RootContainer>
    </>
  );
};

export default StudentsAccountsPage;
