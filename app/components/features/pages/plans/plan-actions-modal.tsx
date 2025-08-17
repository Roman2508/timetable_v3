import z from "zod"
import { useSelector } from "react-redux"
import { useState, type Dispatch, type FC, type SetStateAction } from "react"

import { useAppDispatch } from "~/store/store"
import { Input } from "~/components/ui/common/input"
import EntitiesDropdown from "../../entities-dropdown"
import { Button } from "~/components/ui/common/button"
import { plansSelector } from "~/store/plans/plans-slice"
import { Separator } from "~/components/ui/common/separator"
import type { PlanActionModalType } from "~/pages/plans-page"
import type { PlansCategoriesType, PlansType } from "~/store/plans/plans-types"
import { createPlan, createPlanCategory, updatePlan, updatePlanCategory } from "~/store/plans/plans-async-actions"
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "~/components/ui/common/dialog"

interface IPlanActionsModalProps {
  modalData: PlanActionModalType
  editablePlan?: PlansType | null
  editableCategory: { id: number; name: string } | null
  setModalData: Dispatch<SetStateAction<PlanActionModalType>>
  setEditableCategory: Dispatch<SetStateAction<{ id: number; name: string } | null>>
}

const planStatusList = [
  { id: "Активний", name: "Активний" },
  { id: "Архів", name: "Архів" },
]

const initialFormData = { name: "", category: 0, status: "Активний" } as const

const formSchema = z.object({
  type: z.enum(["create-category", "update-category", "create-plan", "update-plan"]),
  name: z.string({ message: "Це поле обов'язкове" }).min(3, { message: "Мінімальна довжина - 3 символа" }),
  category: z.number({ message: "Це поле обов'язкове" }).optional(),
  status: z.enum(["Активний", "Архів"], { message: "Це поле обов'язкове" }).optional(),
})

export type FormData = z.infer<typeof formSchema>

const PlanActionsModal: FC<IPlanActionsModalProps> = ({
  modalData,
  setModalData,
  editablePlan,
  editableCategory,
  setEditableCategory,
}) => {
  const dispatch = useAppDispatch()

  const { plansCategories } = useSelector(plansSelector)

  const [isPending, setIsPending] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [userFormData, setUserFormData] = useState<Partial<FormData>>({})

  const formData = {
    ...initialFormData,
    ...editableCategory,
    ...editablePlan,
    category: editablePlan?.category.id,
    status: editablePlan ? editablePlan.status : initialFormData.status,
    ...userFormData,
    type: modalData.type,
  }

  const reset = () => {
    setEditableCategory(null)
    setUserFormData({})
  }

  const onOpenChange = (value: boolean) => {
    setModalData((prev) => ({ ...prev, isOpen: value }))
    if (!value) reset()
  }

  const validate = () => {
    const res = formSchema.safeParse(formData)
    if (!res.success) {
      return res.error.format()
    }

    if (modalData.type.includes("plan") && !formData.category) {
      return { success: false, category: { _errors: ["Категорія є обов'язковою"] } }
    }

    if (modalData.type === "update-plan" && !formData.status) {
      return { success: false, category: { _errors: ["Це поле обов'язкове"] } }
    }
  }

  const errors = showErrors ? validate() : undefined

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()

    const errors = validate()
    if (errors) {
      console.log(true)
      setShowErrors(true)
      return
    }

    try {
      setIsPending(true)
      if (modalData.type === "create-category") {
        await dispatch(createPlanCategory({ name: formData.name }))
        setModalData({ isOpen: false, type: "create-plan" })
        reset()
        return
      }

      if (modalData.type === "update-category" && editableCategory) {
        await dispatch(updatePlanCategory({ id: editableCategory.id, name: formData.name }))
        setModalData({ isOpen: false, type: "create-plan" })
        reset()
      }

      if (modalData.type === "create-plan" && formData.category) {
        await dispatch(createPlan({ name: formData.name, categoryId: formData.category }))
        setModalData({ isOpen: false, type: "create-plan" })
        reset()
      }

      if (modalData.type === "update-plan" && formData.category && formData.status && editablePlan) {
        await dispatch(
          updatePlan({
            name: formData.name,
            id: editablePlan.id,
            status: formData.status,
            categoryId: formData.category,
          }),
        )
        setModalData({ isOpen: false, type: "create-plan" })
        reset()
      }
    } finally {
      setIsPending(false)
    }
  }

  const activeCategoryItem = plansCategories
    ? plansCategories.find((el: PlansCategoriesType) => el.id === formData.category)
    : { id: "", name: "" }

  return (
    <Dialog open={modalData.isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {modalData.type === "update-plan" && "Оновити навчальний план:"}
            {modalData.type === "create-plan" && "Створити новий план:"}
            {modalData.type === "create-category" && "Створити нову категорію:"}
            {modalData.type === "update-category" && "Оновити підрозділ:"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 mt-1 flex flex-col gap-1">
              <h5 className="text-md">{modalData.type.includes("category") ? "Назва підрозділу*" : "Назва плану*"}</h5>
              <Input
                value={formData.name}
                onChange={(e) => setUserFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
              {/* @ts-ignore */}
              <p className="text-error text-sm mt-1">{errors?.name?._errors.join(", ")}</p>
            </div>

            {modalData.type.includes("plan") && (
              <>
                <div className="mb-4 mt-1 flex flex-col gap-1">
                  <h5 className="text-md">Категорія*</h5>
                  <EntitiesDropdown
                    activeItem={activeCategoryItem}
                    items={plansCategories ? plansCategories : []}
                    onChangeSelected={(value) => setUserFormData((prev) => ({ ...prev, category: Number(value) }))}
                  />
                  <p className="text-error text-sm mt-1">{errors?.category?._errors.join(", ")}</p>
                </div>

                <div className="mb-4 mt-1 flex flex-col gap-1">
                  <h5 className="text-md">Статус*</h5>
                  <EntitiesDropdown
                    items={planStatusList}
                    activeItem={{ id: String(formData.status), name: String(formData.status) }}
                    onChangeSelected={(value) =>
                      setUserFormData((prev) => ({ ...prev, status: String(value) as "Активний" | "Архів" }))
                    }
                  />
                  {/* @ts-ignore */}
                  <p className="text-error text-sm mt-1">{errors?.status?._errors.join(", ")}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="flex !justify-start pt-6">
              <Button disabled={isPending}>{modalData.type.includes("create") ? "Створити" : "Оновити"}</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default PlanActionsModal
