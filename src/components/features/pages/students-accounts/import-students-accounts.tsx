import * as XLSX from "xlsx"
import { ArrowRightFromLine, Download, MessageCircleQuestion } from "lucide-react"
import { useRef, useState, type Dispatch, type FC, type SetStateAction } from "react"

import { useAppDispatch } from "@/store/store"
import { Button } from "@/components/ui/common/button"
import type { CreateStudentsPayloadType } from "@/api/api-types"
import { createStudent } from "@/store/students/students-async-actions"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"

interface IImportStudentsAccountsProps {
  setHelperModalOpen: Dispatch<SetStateAction<boolean>>
}

const ImportStudentsAccounts: FC<IImportStudentsAccountsProps> = ({ setHelperModalOpen }) => {
  const dispatch = useAppDispatch()

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [disabledUploadButton, setDisabledUploadButton] = useState(false)

  const onClickUpload = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const handleChangeUpload = (e: any /* Event */) => {
    e.preventDefault()

    const files = (e.target as HTMLInputElement).files

    if (!files?.length) return

    const f = files[0]
    const reader = new FileReader()

    reader.onload = function (e) {
      if (e.target === null) return

      const data = e.target.result
      let readedData = XLSX.read(data, { type: "binary" })
      const wsname = readedData.SheetNames[0]
      const ws = readedData.Sheets[wsname]

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

      const newStudents = dataParse
        .map((el, index) => {
          if (index === 0) return

          const element = el as string[]

          const obj: CreateStudentsPayloadType = {
            name: String(element[0]),
            login: String(element[1]),
            password: String(element[2]),
            email: String(element[3]),
            group: element[4],
          }

          return obj
        })
        .filter((el) => !!el)

      Promise.all(
        newStudents.map(async (el) => {
          if (!el) return
          try {
            setDisabledUploadButton(true)
            dispatch(createStudent(el))
          } catch (err) {
            console.log(err)
          } finally {
            setDisabledUploadButton(false)
          }
        }),
      )
    }
    reader.readAsBinaryString(f)
    if (!fileRef.current) return
    fileRef.current.value = ""
  }

  return (
    <>
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <Button variant="outline" onClick={() => setHelperModalOpen(true)}>
            <MessageCircleQuestion />
          </Button>
        </TooltipTrigger>
        <TooltipContent>В якому форматі має бути Excel файл?</TooltipContent>
      </Tooltip>

      <input type="file" ref={fileRef} onChange={handleChangeUpload} style={{ display: "none" }} />
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <Button variant="outline" onClick={onClickUpload} disabled={disabledUploadButton}>
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Імпортувати студентів до групи</TooltipContent>
      </Tooltip>
    </>
  )
}

export default ImportStudentsAccounts
