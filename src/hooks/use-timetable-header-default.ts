import { useSelector } from "react-redux"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

import { useAppDispatch } from "@/store/store"
import { groupsSelector } from "@/store/groups/groups-slice"
import { teachersSelector } from "@/store/teachers/teachers-slice"
import { getTeacherFullname } from "@/helpers/get-teacher-fullname"
import { auditoriesSelector } from "@/store/auditories/auditories-slise"
import { generalSelector, setTimetableData } from "@/store/general/general-slice"

interface IListItem {
  id: number
  name: string
}

const useTimetableHeaderDefault = ({
  setSlectedGroupId,
}: {
  setSlectedGroupId: Dispatch<SetStateAction<number | null>>
}) => {
  const dispatch = useAppDispatch()

  const {
    timetable: { item, category, type },
  } = useSelector(generalSelector)

  const { groupCategories } = useSelector(groupsSelector)
  const { teachersCategories } = useSelector(teachersSelector)
  const { auditoriCategories } = useSelector(auditoriesSelector)

  const [itemsList, setItemsList] = useState<IListItem[]>([])
  const [categoriesList, setCategoriesList] = useState<IListItem[]>([])

  useEffect(() => {
    // if data does not exist in default
    if (!type || !category || !item) {
      if (!groupCategories || !groupCategories.length) return
      const defaultTimetableData = {
        type: "group",
        item: groupCategories[0].groups[0].id,
        category: groupCategories[0].id,
      }
      dispatch(setTimetableData(defaultTimetableData))

      const categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const itemsList = groupCategories[0].groups.map((el) => ({ id: el.id, name: el.name }))
      setItemsList(itemsList)

      setSlectedGroupId(groupCategories[0].groups[0]?.id)
    }

    // if data exist in default
    if (type === "group" && groupCategories) {
      const categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const selectedCategory = groupCategories.find((el) => el.id === category)

      if (selectedCategory) {
        const itemsList = selectedCategory.groups.map((el) => ({ id: el.id, name: el.name }))
        setItemsList(itemsList)
      }
    }
    //
    else if (type === "teacher" && teachersCategories) {
      const categoriesList = teachersCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const selectedCategory = teachersCategories.find((el) => el.id === category)

      if (selectedCategory) {
        const itemsList = selectedCategory.teachers.map((el) => ({ id: el.id, name: getTeacherFullname(el, "short") }))
        setItemsList(itemsList)
      }
    }
    //
    else if (type === "auditory" && auditoriCategories) {
      const categoriesList = auditoriCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const selectedCategory = auditoriCategories.find((el) => el.id === category)

      if (selectedCategory) {
        const itemsList = selectedCategory.auditories.map((el) => ({ id: el.id, name: el.name }))
        setItemsList(itemsList)
      }
    }
  }, [groupCategories, teachersCategories, auditoriCategories])

  return { categoriesList, itemsList }
}

export { useTimetableHeaderDefault }
