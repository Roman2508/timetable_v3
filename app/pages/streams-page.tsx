import { useState } from "react";
import { GraduationCap } from "lucide-react";

import CategoryActionsModal, {
  type FormData,
} from "~/components/features/category-actions-modal/category-actions-modal";
import type {
  UpdatingCategoryType,
  CategoryModalStateType,
} from "~/components/features/category-actions-modal/category-actions-modal-types";
import EntityHeader from "~/components/features/entity-header";
import type { StreamsType } from "~/store/streams/streams-types";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import StreamsListDrawer from "~/components/features/pages/streams/streams-list-drawer";
import { StreamsLessonsTable } from "~/components/features/pages/streams/streams-lessons-table";
import { useAppDispatch } from "~/store/store";
import { createStream, updateStream } from "~/store/streams/streams-async-actions";

const semesters = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
];

const StreamsPage = () => {
  const dispatch = useAppDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(semesters);
  const [selectedStream, setSelectedStream] = useState<StreamsType | null>(null);
  const [preSelectedStream, setPreSelectedStream] = useState<StreamsType | null>(null);
  const [updatingStream, setUpdatingStream] = useState<UpdatingCategoryType | null>(null);
  const [modalData, setModalData] = useState<CategoryModalStateType>({ isOpen: false, actionType: "create" });

  const onCreateStream = async (data: FormData) => {
    try {
      await dispatch(createStream({ name: data.name }));
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateStream = async (data: FormData & { id: number }) => {
    try {
      await dispatch(updateStream({ id: data.id, name: data.name }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CategoryActionsModal
        isOnlyName
        modalData={modalData}
        nameLabel="Назва потоку*"
        setModalData={setModalData}
        updatingCategory={updatingStream}
        onCreateCategory={onCreateStream}
        onUpdateCategory={onUpdateStream}
        setUpdatingCategory={setUpdatingStream}
        title={modalData.actionType === "create" ? "Створити новий потік" : "Оновити потік*"}
      />

      <RootContainer classNames="flex gap-10 !min-h-[calc(100vh-160px)]">
        <div className="flex flex-col flex-1">
          <div className="flex w-full justify-between items-center mb-4">
            {selectedStream ? (
              <EntityHeader Icon={GraduationCap} label="ПОТІК" status="Активний" name={selectedStream.name} />
            ) : (
              <h2 className="flex items-center h-14 text-2xl font-semibold">Виберіть потік</h2>
            )}

            <div className="flex items-center gap-4">
              <InputSearch placeholder="Знайти..." />

              <PopoverFilter
                enableSelectAll
                label="Семестри"
                items={semesters}
                itemsPrefix="Семестр"
                filterVariant="default"
                selectAllLabel="Вибрати всі"
                selectedItems={selectedSemester}
                setSelectedItems={setSelectedSemester}
              />

              <StreamsListDrawer
                setModalData={setModalData}
                isDrawerOpen={isDrawerOpen}
                selectedStream={selectedStream}
                setIsDrawerOpen={setIsDrawerOpen}
                setSelectedStream={setSelectedStream}
                preSelectedStream={preSelectedStream}
                setUpdatingStream={setUpdatingStream}
                setPreSelectedStream={setPreSelectedStream}
              />
            </div>
          </div>

          {true ? (
            <StreamsLessonsTable selectedStream={selectedStream} />
          ) : (
            <div className="text-center font-mono py-20">Виберіть потік для об'єднання дисциплін.</div>
          )}
        </div>
      </RootContainer>
    </>
  );
};

export default StreamsPage;
