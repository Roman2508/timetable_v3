import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { useAppDispatch } from "~/store/store"
import { Button } from "~/components/ui/common/button"
import { settingsSelector } from "~/store/settings/settings-slice"
import { InputCalendar } from "~/components/ui/custom/input-calendar"
import { updateSemesterTerms } from "~/store/settings/settings-async-actions"

// MM.DD.YYYY
const semesterTermsInitialState = {
  firstSemesterStart: "",
  firstSemesterEnd: "",
  secondSemesterStart: "",
  secondSemesterEnd: "",
  // firstSemesterStart: "09.01.2023",
  // firstSemesterEnd: "12.24.2023",
  // secondSemesterStart: "02.01.2024",
  // secondSemesterEnd: "06.30.2024",
}

const EducationTermsTab = () => {
  const dispatch = useAppDispatch()

  const { settings } = useSelector(settingsSelector)

  const [isFetching, setIsFetching] = useState(false)
  const [semesterTerms, setSemesterTerms] = useState(semesterTermsInitialState)

  const handleChangeSemesterTerms = (key: keyof typeof semesterTermsInitialState, value: string) => {
    setSemesterTerms((prev) => ({ ...prev, [key]: value }))
  }

  const fetchSemesterTerms = async () => {
    try {
      setIsFetching(true)
      await dispatch(updateSemesterTerms(semesterTerms))
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (!settings) return
    setSemesterTerms((prev) => {
      const { firstSemesterStart, firstSemesterEnd, secondSemesterStart, secondSemesterEnd } = settings
      return { ...prev, firstSemesterStart, firstSemesterEnd, secondSemesterStart, secondSemesterEnd }
    })
  }, [settings])

  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <CalendarIcon className="w-5" /> Терміни навчання
      </h2>

      <div className="mb-10">
        <p className="text-muted-foreground mb-6">
          Тут ви можете оновити дати початку й завершення навчання — це впливає на доступність дат у редакторі розкладу
          та календарі. Терміни навчання потрібно вказувати перед початком кожного навчального року
        </p>

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">Перше півріччя</h2>
        <InputCalendar
          label="Початок"
          value={semesterTerms.firstSemesterStart}
          onValueChange={(e) => handleChangeSemesterTerms("firstSemesterStart", e)}
        />
        <InputCalendar
          label="Кінець"
          value={semesterTerms.firstSemesterEnd}
          onValueChange={(e) => handleChangeSemesterTerms("firstSemesterEnd", e)}
        />

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 mt-10">Друге півріччя</h2>
        <InputCalendar
          label="Початок"
          value={semesterTerms.secondSemesterStart}
          onValueChange={(e) => handleChangeSemesterTerms("secondSemesterStart", e)}
        />
        <InputCalendar
          label="Кінець"
          value={semesterTerms.secondSemesterEnd}
          onValueChange={(e) => handleChangeSemesterTerms("secondSemesterEnd", e)}
        />

        <Button className="mt-8" disabled={isFetching} onClick={fetchSemesterTerms}>
          {isFetching ? "Завантаження..." : "Зберегти зміни"}
        </Button>
      </div>
    </>
  )
}

export { EducationTermsTab }
