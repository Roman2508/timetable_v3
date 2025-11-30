import { useSelector } from "react-redux"
import { useState, type Dispatch, type SetStateAction, type FC, useCallback, useEffect } from "react"

import { useAppDispatch } from "@/store/store"
import { groupsSelector } from "@/store/groups/groups-slice"
import type { ISelectedLesson } from "@/pages/timetable-page"
import { teachersSelector } from "@/store/teachers/teachers-slice"
import DropdownSelect from "@/components/ui/custom/dropdown-select"
import { getTeacherFullname } from "@/helpers/get-teacher-fullname"
import { auditoriesSelector } from "@/store/auditories/auditories-slise"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import { useTimetableHeaderDefault } from "@/hooks/use-timetable-header-default"
import { generalSelector, setTimetableData } from "@/store/general/general-slice"
import { clearTeacherLessons } from "@/store/schedule-lessons/schedule-lessons-slice"

const semesters = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
]

interface IListItem {
  id: number
  name: string
}

interface ITimetableHeaderProps {
  weeksCount: number
  setSlectedGroupId: Dispatch<SetStateAction<number | null>>
  setSelectedLesson: Dispatch<SetStateAction<ISelectedLesson | null>>
}

const TimetableHeader: FC<ITimetableHeaderProps> = ({ weeksCount, setSelectedLesson, setSlectedGroupId }) => {
  const dispatch = useAppDispatch()

  const {
    timetable: { semester, week, item, category, type },
  } = useSelector(generalSelector)

  const { groupCategories } = useSelector(groupsSelector)
  const { teachersCategories } = useSelector(teachersSelector)
  const { auditoriCategories } = useSelector(auditoriesSelector)

  const { itemsList: defaultItemsList, categoriesList: defaultCategoriesList } = useTimetableHeaderDefault({
    setSlectedGroupId,
  })
  const [itemsList, setItemsList] = useState<IListItem[]>([])
  const [categoriesList, setCategoriesList] = useState<IListItem[]>([])

  const weeksList = useCallback(() => {
    const weeks: { id: number; name: string }[] = []
    for (let i = 0; i < weeksCount; i++) {
      weeks.push({ id: Number(i + 1), name: String(i + 1) })
    }
    return weeks
  }, [weeksCount])

  const onCategoryChange = (categoryId: number) => {
    dispatch(clearTeacherLessons())

    if (type === "group" && groupCategories) {
      const groupsCategory = groupCategories.find((el) => el.id === categoryId)
      if (!groupsCategory) return
      const itemsList = groupsCategory.groups.map((el) => ({ id: el.id, name: el.name }))
      setItemsList(itemsList)
      setSlectedGroupId(groupsCategory.groups[0].id || null)
      dispatch(setTimetableData({ type: "group", item: itemsList[0]?.id, category: categoryId || groupsCategory.id }))
      return
    }

    if (type === "teacher" && teachersCategories) {
      const teachersCategory = teachersCategories.find((el) => el.id === categoryId)
      if (!teachersCategory) return
      const itemsList = teachersCategory.teachers.map((el) => ({ id: el.id, name: getTeacherFullname(el, "short") }))
      console.log("itemsList", itemsList, "teachersCategory.teachers", teachersCategory.teachers)
      setItemsList(itemsList)
      dispatch(
        setTimetableData({ type: "teacher", item: itemsList[0]?.id, category: categoryId || teachersCategory.id }),
      )
      return
    }

    if (type === "auditory" && auditoriCategories) {
      const auditoriCategory = auditoriCategories.find((el) => el.id === categoryId)
      if (!auditoriCategory) return
      const itemsList = auditoriCategory.auditories.map((el) => ({ id: el.id, name: el.name }))
      setItemsList(itemsList)
      dispatch(
        setTimetableData({ type: "auditory", item: itemsList[0]?.id, category: categoryId || auditoriCategory.id }),
      )
    }
  }

  const onTabChange = (type: string) => {
    if (!groupCategories || !teachersCategories || !auditoriCategories) return

    let item = null
    let category = null

    if (type === "group") {
      const categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const itemsList = groupCategories[0]?.groups.map((el) => ({ id: el.id, name: el.name }))
      setItemsList(itemsList)

      item = groupCategories[0].groups[0]?.id
      category = groupCategories[0].id
    }

    if (type === "teacher") {
      const categoriesList = teachersCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const teachers = teachersCategories[0]?.teachers
      const itemsList = teachers.map((el) => ({ id: el.id, name: getTeacherFullname(el, "short") }))
      setItemsList(itemsList)

      item = teachersCategories[0].teachers[0]?.id
      category = teachersCategories[0].id
    }

    if (type === "auditory") {
      const categoriesList = auditoriCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const itemsList = auditoriCategories[0]?.auditories?.map((el) => ({ id: el.id, name: el.name }))
      setItemsList(itemsList)

      item = auditoriCategories[0].auditories[0]?.id
      category = auditoriCategories[0].id
    }

    dispatch(setTimetableData({ type, item, category }))
  }

  useEffect(() => {
    if (defaultCategoriesList.length) {
      setCategoriesList(defaultCategoriesList)
    }
    if (defaultItemsList.length) {
      setItemsList(defaultItemsList)
    }
  }, [defaultCategoriesList, defaultItemsList])

  return (
    <div className="flex 2xl:justify-between items-center mb-4 2xl:gap-0 gap-3 2xl:flex-row flex-col">
      <div className="flex gap-3">
        <DropdownSelect
          classNames="2xl:w-75 w-60 2xl:!px-4 !px-2 2xl:h-10 h-8 2xl:text-sm text-[12px]"
          label="Категорії"
          items={categoriesList}
          onChange={(category) => onCategoryChange(category)}
          selectedItem={category || null}
        />

        <DropdownSelect
          classNames="2xl:w-55 w-35 2xl:!px-4 !px-2 2xl:h-10 h-8 2xl:text-sm text-[12px]"
          items={itemsList}
          selectedItem={item || null}
          onChange={(item) => dispatch(setTimetableData({ item }))}
          label={type === "group" ? "Група" : type === "teacher" ? "Викладач" : type === "auditory" ? "Аудиторія" : ""}
        />

        <DropdownSelect
          classNames="2xl:w-30 w-25 2xl:!px-4 !px-2 2xl:h-10 h-8 2xl:text-sm text-[12px]"
          label="Семестр"
          items={semesters}
          selectedItem={semester || null}
          onChange={(semester) => dispatch(setTimetableData({ semester }))}
        />

        <DropdownSelect
          sortBy="id"
          classNames="2xl:w-30 w-25 2xl:!px-4 !px-2 2xl:h-10 h-8 2xl:text-sm text-[12px]"
          label="Тиждень"
          items={weeksList()}
          selectedItem={week || null}
          onChange={(week) => dispatch(setTimetableData({ week }))}
        />
      </div>

      <Tabs defaultValue={type || "group"} onValueChange={(value) => onTabChange(value)}>
        <TabsList className="h-full">
          <TabsTrigger value="group" className="h-8 px-4">
            Групи
          </TabsTrigger>
          <TabsTrigger value="teacher" className="h-8 px-4">
            Викладачі
          </TabsTrigger>
          <TabsTrigger value="auditory" className="h-8 px-4">
            Аудиторії
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default TimetableHeader
