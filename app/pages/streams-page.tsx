import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

import CategoryActionsModal, {
  type FormData,
} from "~/components/features/category-actions-modal/category-actions-modal";
import type {
  UpdatingCategoryType,
  CategoryModalStateType,
} from "~/components/features/category-actions-modal/category-actions-modal-types";
import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { STREAMS_FILTERS } from "~/constants/cookies-keys";
import EntityHeader from "~/components/features/entity-header";
import { generalSelector, setStreamFilters } from "~/store/general/general-slice";
import type { StreamsType } from "~/store/streams/streams-types";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import type { StreamLessonType } from "~/helpers/group-lessons-by-streams";
import { createStream, updateStream } from "~/store/streams/streams-async-actions";
import StreamsListDrawer from "~/components/features/pages/streams/streams-list-drawer";
import { StreamsLessonsTable } from "~/components/features/pages/streams/streams-lessons-table";
import StreamLessonDetailsModal from "~/components/features/pages/streams/stream-lesson-details-modal";
import CombineStreamLessonsModal from "~/components/features/pages/streams/combine-stream-lessons-modal";

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

  const [_, setCookie] = useCookies();

  const {
    streams: { semesters: defaultSelectedSemesters },
  } = useSelector(generalSelector);

  const [selectedSemester, setSelectedSemester] = useState(
    defaultSelectedSemesters.length
      ? defaultSelectedSemesters.split(",").map((sem) => ({ id: Number(sem), name: sem }))
      : semesters,
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCombineModalOpen, setIsCombineModalOpen] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState<StreamLessonType[]>([]);
  const [selectedStream, setSelectedStream] = useState<StreamsType | null>(null);
  const [preSelectedStream, setPreSelectedStream] = useState<StreamsType | null>(null);
  const [updatingStream, setUpdatingStream] = useState<UpdatingCategoryType | null>(null);
  const [selectedLessonFromDetails, setSelectedLessonFromDetails] = useState<StreamLessonType | null>(null);
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

  useEffect(() => {
    if (!selectedSemester.length) return;
    const semestersString = selectedSemester.map((el) => el.id).join(",");
    setCookie(STREAMS_FILTERS, semestersString);
    dispatch(setStreamFilters(semestersString));
  }, [selectedSemester]);

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

      <CombineStreamLessonsModal
        isOpen={isCombineModalOpen}
        selectedStream={selectedStream}
        setIsOpen={setIsCombineModalOpen}
        selectedLessons={selectedLessons}
      />

      <StreamLessonDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        selectedLessonFromDetails={selectedLessonFromDetails}
        setSelectedLessonFromDetails={setSelectedLessonFromDetails}
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
              <InputSearch
                value={globalFilter}
                placeholder="Знайти..."
                onChange={(e) => setGlobalFilter(e.target.value)}
              />

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

              {selectedLessons.length > 1 && <Button onClick={() => setIsCombineModalOpen(true)}>Об'єднати</Button>}

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
            <StreamsLessonsTable
              globalFilter={globalFilter}
              selectedStream={selectedStream}
              setGlobalFilter={setGlobalFilter}
              selectedLessons={selectedLessons}
              selectedSemester={selectedSemester}
              setSelectedLessons={setSelectedLessons}
              setIsDetailsModalOpen={setIsDetailsModalOpen}
              setSelectedLessonFromDetails={setSelectedLessonFromDetails}
            />
          ) : (
            <div className="text-center font-mono py-20">Виберіть потік для об'єднання дисциплін.</div>
          )}
        </div>
      </RootContainer>
    </>
  );
};

export default StreamsPage;
