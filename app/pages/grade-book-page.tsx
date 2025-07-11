import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { WideContainer } from "~/components/layouts/wide-container";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { gradeBookSelector } from "~/store/gradeBook/grade-book-slice";
import { ListFilter, NotebookPen, Printer, UnfoldVertical } from "lucide-react";
import { GradeBookTable } from "~/components/features/pages/grade-book/grade-book-table";
import SelectGradeBookModal from "~/components/features/pages/grade-book/select-grade-book-modal";

export default function PlansPage() {
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const { gradeBook, loadingStatus } = useSelector(gradeBookSelector);

  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
  const [isOpenSummaryModal, setIsOpenSummaryModal] = useState(false);
  const [gradeBookLessonDates, setGradeBookLessonDates] = useState<{ date: string }[]>([]);

  useEffect(() => {
    const groupId = searchParams.get("groupId");
    const lessonId = searchParams.get("lessonId");
    const semester = searchParams.get("semester");
    const lessonType = searchParams.get("lessonType");

    if (!groupId || !lessonId || !semester || !lessonType) return;
    fetchGradeBook(Number(groupId), Number(lessonId), Number(semester), lessonType);
  }, [searchParams]);

  return (
    <>
      <SelectGradeBookModal
        open={isOpenFilterModal}
        setOpen={setIsOpenFilterModal}
        setGradeBookLessonDates={setGradeBookLessonDates}
      />

      <WideContainer>
        <div className="flex justify-between mb-6">
          {gradeBook ? (
            <div className="flex gap-5">
              <div className="pr-5 border-r">
                <p className="text-xs">Дисципліна</p>
                <h3 className="text-sm font-semibold">{`${gradeBook.lesson.name}, ${gradeBook.lesson.semester} семестр`}</h3>
              </div>

              <div className="pr-5 border-r">
                <p className="text-xs">Група</p>
                <h3 className="text-sm font-semibold">{gradeBook.group.name}</h3>
              </div>

              <div>
                <p className="text-xs">Викладач</p>
                <h3 className="text-sm font-semibold">{getTeacherFullname(gradeBook.lesson.teacher, "short")}</h3>
              </div>
            </div>
          ) : (
            <p className="font-mono">Виберіть групу</p>
          )}

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsOpenFilterModal(true)}>
              <ListFilter />
            </Button>
            <Button variant="outline">
              <UnfoldVertical className="rotate-[90deg]" />
            </Button>
            <Button variant="outline">
              <NotebookPen />
            </Button>
            <Button variant="outline">
              <Printer />
            </Button>
          </div>
        </div>

        <GradeBookTable />
      </WideContainer>
    </>
  );
}
