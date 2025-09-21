import React, { useRef, useState } from "react"

import { useSelector } from "react-redux"
import { PenLine, X } from "lucide-react"

import { useAppDispatch } from "@/store/store"
import { Input } from "@/components/ui/common/input"
import { Button } from "@/components/ui/common/button"
import type { GroupLoadType } from "@/store/groups/groups-types"
import { teacherProfileSelector } from "@/store/teacher-profile/teacher-profile-slice"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/common/table"
import {
  createInstructionalMaterials,
  updateInstructionalMaterials,
} from "@/store/teacher-profile/teacher-profile-async-actions"

interface IInstructionalMaterialsTableProps {
  showedYear: number
  selectedLesson: GroupLoadType
}

export const InstructionalMaterialsTable: React.FC<IInstructionalMaterialsTableProps> = ({
  showedYear,
  selectedLesson,
}) => {
  const dispatch = useAppDispatch()

  const { instructionalMaterials } = useSelector(teacherProfileSelector)

  const inputRef = useRef<HTMLInputElement>(null)

  const [actionType, setActionType] = useState<"create" | "update">("create")
  const [editedTheme, setEditedTheme] = useState({ lessonNumber: 0, theme: "", id: 0 })

  const handleEditTheme = (lessonNumber: number, theme: string, id: number) => {
    if (!selectedLesson) return alert("Урок не вибраний")
    setEditedTheme({ lessonNumber, theme, id })

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus()
    })

    if (theme) setActionType("update")
    else setActionType("create")
  }

  const setLessonTheme = async () => {
    if (!selectedLesson) return alert("Урок не вибраний")

    if (actionType === "create") {
      const payload = {
        name: editedTheme.theme,
        lessonNumber: editedTheme.lessonNumber,
        lessonId: selectedLesson.id,
        year: showedYear,
      }
      await dispatch(createInstructionalMaterials(payload))
      return
    }

    if (actionType === "update") {
      const payload = {
        name: editedTheme.theme,
        id: editedTheme.id,
        lessonId: selectedLesson.id,
        lessonNumber: editedTheme.lessonNumber,
      }
      await dispatch(updateInstructionalMaterials(payload))
    }

    setEditedTheme({ lessonNumber: 0, theme: "", id: 0 })
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableCell className="uppercase font-mono w-[5%]">№</TableCell>
          <TableCell className="uppercase font-mono w-[80%]">Тема</TableCell>
          <TableCell className="uppercase font-mono w-[10%]">Години</TableCell>
          <TableCell className="uppercase font-mono w-[5%] text-right">Дії</TableCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {[...Array(selectedLesson ? selectedLesson.hours : 0)].map((_, index) => {
          const rowNumber = index + 1
          const isLast = selectedLesson?.hours === rowNumber
          const theme = instructionalMaterials?.find((el) => el.lessonNumber === rowNumber)
          const themeName = theme ? theme.name : "-"

          return (
            <TableRow className="hover:bg-border/40">
              <TableCell className="py-0">{rowNumber}</TableCell>
              <TableCell className="py-0">
                {editedTheme.lessonNumber === rowNumber ? (
                  <Input
                    className="border-0 bg-transparent"
                    ref={inputRef}
                    value={editedTheme.theme}
                    onChange={(e) => setEditedTheme((prev) => ({ ...prev, theme: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setLessonTheme()
                      if (e.key === "Escape") setEditedTheme({ lessonNumber: 0, theme: "", id: 0 })
                    }}
                  />
                ) : (
                  themeName
                )}
              </TableCell>
              <TableCell className="py-0">{theme && !isLast ? 2 : theme && isLast ? 1 : "-"}</TableCell>
              <TableCell className="py-0 text-right">
                {editedTheme.lessonNumber === rowNumber ? (
                  <Button variant="ghost" onClick={(e) => handleEditTheme(0, "", 0)}>
                    <X />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={(e) => handleEditTheme(rowNumber, theme ? theme.name : "", theme ? theme.id : 0)}
                  >
                    <PenLine />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
