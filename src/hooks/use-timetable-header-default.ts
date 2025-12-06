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
    // Якщо дані з бекенду ще не завантажились - чекаємо
    // (If backend data hasn't loaded yet - wait)
    if (!groupCategories || !groupCategories.length) return

    // Якщо в Redux немає type, category або item - встановлюємо дефолтні значення
    // (If Redux doesn't have type, category, or item - set default values)
    // Redux Persist автоматично відновить ці значення якщо вони були збережені раніше
    // (Redux Persist will automatically restore these values if they were saved previously)
    if (!type || !category || !item) {
      // Дефолт: Група -> Перша категорія -> Перша група, Семестр 1, Тиждень 1
      // (Default: Group -> First Category -> First Group, Semester 1, Week 1)
      const firstCategory = groupCategories[0]
      const firstGroup = firstCategory.groups[0]

      const defaultTimetableData = {
        type: "group" as const,
        item: firstGroup?.id,
        category: firstCategory.id,
        semester: 1,
        week: 1,
      }

      dispatch(setTimetableData(defaultTimetableData))

      const categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const itemsList = firstCategory.groups.map((el) => ({ id: el.id, name: el.name }))
      setItemsList(itemsList)

      setSlectedGroupId(firstGroup?.id)
      return
    }

    // Якщо type, category, item вже є в Redux (або відновлені через Redux Persist),
    // синхронізуємо списки для dropdown'ів
    // (If type, category, item already exist in Redux (or restored via Redux Persist),
    // sync the lists for dropdowns)

    if (type === "group" && groupCategories) {
      const categoriesList = groupCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const selectedCategory = groupCategories.find((el) => el.id === category)

      if (selectedCategory) {
        const itemsList = selectedCategory.groups.map((el) => ({ id: el.id, name: el.name }))
        setItemsList(itemsList)

        // Перевіряємо, чи існує збережений item в списку
        // (Check if the saved item exists in the list)
        const itemExists = selectedCategory.groups.find((g) => g.id === item)
        if (itemExists) {
          setSlectedGroupId(item)
        } else {
          // Якщо збережений item не знайдено -встановлюємо перший доступний
          // (If saved item not found - set first available)
          const firstItem = selectedCategory.groups[0]
          setSlectedGroupId(firstItem?.id)
          dispatch(setTimetableData({ item: firstItem?.id }))
        }
      } else {
        // Якщо збережена категорія не знайдена - встановлюємо першу доступну
        // (If saved category not found - set first available)
        const firstCategory = groupCategories[0]
        const firstGroup = firstCategory.groups[0]

        const categoriesListFallback = groupCategories.map((el) => ({ id: el.id, name: el.name }))
        setCategoriesList(categoriesListFallback)

        const itemsListFallback = firstCategory.groups.map((el) => ({ id: el.id, name: el.name }))
        setItemsList(itemsListFallback)

        setSlectedGroupId(firstGroup?.id)
        dispatch(setTimetableData({ category: firstCategory.id, item: firstGroup?.id }))
      }
    } else if (type === "teacher" && teachersCategories) {
      const categoriesList = teachersCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const selectedCategory = teachersCategories.find((el) => el.id === category)

      if (selectedCategory) {
        const itemsList = selectedCategory.teachers.map((el) => ({
          id: el.id,
          name: getTeacherFullname(el, "short"),
        }))
        setItemsList(itemsList)
        setSlectedGroupId(null)

        // Перевірка існування збереженого викладача
        // (Check if saved teacher exists)
        const itemExists = selectedCategory.teachers.find((t) => t.id === item)
        if (!itemExists && selectedCategory.teachers.length > 0) {
          dispatch(setTimetableData({ item: selectedCategory.teachers[0].id }))
        }
      } else {
        // Fallback для викладачів (Fallback for teachers)
        const firstCategory = teachersCategories[0]
        const firstTeacher = firstCategory.teachers[0]

        const categoriesListFallback = teachersCategories.map((el) => ({ id: el.id, name: el.name }))
        setCategoriesList(categoriesListFallback)

        const itemsListFallback = firstCategory.teachers.map((el) => ({
          id: el.id,
          name: getTeacherFullname(el, "short"),
        }))
        setItemsList(itemsListFallback)

        setSlectedGroupId(null)
        dispatch(setTimetableData({ category: firstCategory.id, item: firstTeacher?.id }))
      }
    } else if (type === "auditory" && auditoriCategories) {
      const categoriesList = auditoriCategories.map((el) => ({ id: el.id, name: el.name }))
      setCategoriesList(categoriesList)

      const selectedCategory = auditoriCategories.find((el) => el.id === category)

      if (selectedCategory) {
        const itemsList = selectedCategory.auditories.map((el) => ({ id: el.id, name: el.name }))
        setItemsList(itemsList)
        setSlectedGroupId(null)

        // Перевірка існування збереженої аудиторії
        // (Check if saved auditory exists)
        const itemExists = selectedCategory.auditories.find((a) => a.id === item)
        if (!itemExists && selectedCategory.auditories.length > 0) {
          dispatch(setTimetableData({ item: selectedCategory.auditories[0].id }))
        }
      } else {
        // Fallback для аудиторій (Fallback for auditories)
        const firstCategory = auditoriCategories[0]
        const firstAuditory = firstCategory.auditories[0]

        const categoriesListFallback = auditoriCategories.map((el) => ({ id: el.id, name: el.name }))
        setCategoriesList(categoriesListFallback)

        const itemsListFallback = firstCategory.auditories.map((el) => ({ id: el.id, name: el.name }))
        setItemsList(itemsListFallback)

        setSlectedGroupId(null)
        dispatch(setTimetableData({ category: firstCategory.id, item: firstAuditory?.id }))
      }
    }
    // ВАЖЛИВО: Ця залежність НЕ включає type, category, item
    // Це означає, що ефект спрацює тільки коли завантажуються дані з бекенду,
    // а НЕ коли користувач змінює фільтри вручну (це обробляється в компоненті TimetableHeader)
  }, [groupCategories, teachersCategories, auditoriCategories, dispatch, setSlectedGroupId])

  return { categoriesList, itemsList }
}

export { useTimetableHeaderDefault }
