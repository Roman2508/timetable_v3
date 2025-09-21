import { Plus } from "lucide-react"
import { useState, type FC } from "react"

import { Button } from "@/components/ui/common/button"
import { InputSearch } from "@/components/ui/custom/input-search"
import { RootContainer } from "@/components/layouts/root-container"
import type { IndividualWorkPlanType } from "@/store/teacher-profile/teacher-profile-types"
import TeacherActivitiesTypesModal from "@/components/features/pages/teacher-activities-types/teacher-activities-types-modal"
import { TeacherActivitiesTypesTable } from "@/components/features/pages/teacher-activities-types/teacher-activities-types-table"

const TeacherActivitiesTypesPage: FC = ({}) => {
  const [globalSearch, setGlobalSearch] = useState("")
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [editedWork, setEditedWork] = useState<IndividualWorkPlanType | null>(null)

  return (
    <>
      <TeacherActivitiesTypesModal
        open={isOpenModal}
        editedWork={editedWork}
        setOpen={setIsOpenModal}
        setEditedWork={setEditedWork}
      />

      <RootContainer classNames="relative">
        <h1 className="text-center font-semibold text-lg mb-8">Види педагогічної діяльності</h1>

        <div className="flex w-full gap-4 mb-6">
          <InputSearch
            value={globalSearch}
            placeholder="Пошук..."
            className="flex-1"
            onChange={(e) => setGlobalSearch(e.target.value)}
          />

          <Button onClick={() => setIsOpenModal(true)}>
            <Plus /> Нова діяльність
          </Button>
        </div>

        <TeacherActivitiesTypesTable
          globalSearch={globalSearch}
          setEditedWork={setEditedWork}
          setIsOpenModal={setIsOpenModal}
          setGlobalSearch={setGlobalSearch}
        />
      </RootContainer>
    </>
  )
}

export default TeacherActivitiesTypesPage
