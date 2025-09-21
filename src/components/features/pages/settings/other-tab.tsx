import { useState } from "react"
import { InfoIcon } from "lucide-react"
import { FaGoogle } from "react-icons/fa"

import { Input } from "@/components/ui/common/input"
import DropdownSelect from "@/components/ui/custom/dropdown-select"

const daysOptions = [
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
]

const OtherTab = () => {
  const [day, setDay] = useState(5)

  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <InfoIcon className="w-5" /> Інше
      </h2>

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <InfoIcon className="w-5" /> Кількість днів в календарі
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут ви можете налаштувати кількість днів в тижні, які будуть відображатися в календарі. <br />
          Це дозволить вам бачити більше подій на календарі
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm mb-1">Кількість днів</p>
        <DropdownSelect
          items={daysOptions}
          classNames="w-full bg-sidebar"
          onChange={(value) => setDay(value)}
          selectedItem={{ id: day, name: String(day) }}
        />
      </div>

      <hr />

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <FaGoogle className="w-5" /> Google API
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут відображається пароль від вашого облікового запису. <br />
          Якщо у вас виникли проблеми зі входом або ви хочете змінити свої облікові дані - зверніться до системного
          адміністратора
        </p>

        <div className="mb-4">
          <p className="text-sm mb-1">label</p>
          <Input value="" readOnly />
        </div>
      </div>
    </>
  )
}

export { OtherTab }
