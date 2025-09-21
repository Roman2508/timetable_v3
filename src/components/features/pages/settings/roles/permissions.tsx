import { Box } from "lucide-react"
import { useSelector } from "react-redux"

import { useAppDispatch } from "@/store/store"
import { Switch } from "@/components/ui/common/switch"
import { LoadingStatusTypes } from "@/store/app-types"
import { rolesSelector } from "@/store/roles/roles-slice"
import { navData } from "@/components/features/sidebar/nav-data"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { createPermission, deletePermission } from "@/store/roles/roles-async-actions"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/common/collapsible"

const Permissions = () => {
  const dispatch = useAppDispatch()

  const { role, loadingStatus } = useSelector(rolesSelector)

  const handleChangePermission = async (checked: boolean, page: string, action: "both" | "read" | "edit") => {
    if (!role) return
    if (checked && action === "both") {
      await dispatch(createPermission({ action: "read", page, roleId: role.id }))
      await dispatch(createPermission({ action: "edit", page, roleId: role.id }))
      return
    }
    if (checked) {
      await dispatch(createPermission({ action, page, roleId: role.id }))
      return
    }

    if (!checked && action === "both") {
      const readPermission = role.permissions.find((el) => el.action === "read" && el.page === page)
      const editPermission = role.permissions.find((el) => el.action === "edit" && el.page === page)
      if (readPermission) {
        await dispatch(deletePermission(readPermission.id))
      }
      if (editPermission) {
        await dispatch(deletePermission(editPermission.id))
      }
      return
    }

    const permission = role.permissions.find((el) => el.action === action && el.page === page)
    if (!permission) return
    await dispatch(deletePermission(permission.id))
  }

  const checkIsChecked = (page: string, action: "read" | "edit") => {
    if (!role) return false
    return !!role.permissions.find((el) => el.action === action && el.page === page)
  }

  if (!role && loadingStatus === LoadingStatusTypes.LOADING)
    return (
      <div className="pt-12">
        <LoadingSpinner />
      </div>
    )

  if (!role) return

  return (
    <>
      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <Box className="w-5" /> Повноваження для ролі: {role.name}
        </h2>

        <p className="text-muted-foreground">
          Тут відображається пароль від вашого облікового запису. <br />
          Якщо у вас виникли проблеми зі входом або ви хочете змінити свої облікові дані - зверніться до системного
          адміністратора
        </p>
      </div>

      {navData.navMain.map((navMain, index) => (
        <div className="my-10" key={index}>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            {<navMain.icon className="w-5" />}
            {navMain.title}
          </h2>

          {navMain.items.map((navItem) => (
            <div className="border p-3 mb-3 border p-3 mb-3">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold">{navItem.title}</div>
                  <div className="text-sm text-muted-foreground">{"el.description"}</div>
                </div>

                <Switch
                  disabled={loadingStatus === LoadingStatusTypes.LOADING}
                  onCheckedChange={(checked) => handleChangePermission(checked, navItem.url, "both")}
                  checked={checkIsChecked(navItem.url, "read") || checkIsChecked(navItem.url, "edit")}
                />
              </div>

              <Collapsible>
                <CollapsibleTrigger className="text-sm underline cursor-pointer">Деталі</CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="mt-2">
                    <li className="flex items-center gap-2 mb-2">
                      <Switch
                        checked={checkIsChecked(navItem.url, "read")}
                        disabled={loadingStatus === LoadingStatusTypes.LOADING}
                        onCheckedChange={(checked) => handleChangePermission(checked, navItem.url, "read")}
                      />
                      <label htmlFor="" className="text-sm">
                        Перегляд
                      </label>
                    </li>

                    <li className="flex items-center gap-2">
                      <Switch
                        checked={checkIsChecked(navItem.url, "edit")}
                        disabled={loadingStatus === LoadingStatusTypes.LOADING}
                        onCheckedChange={(checked) => handleChangePermission(checked, navItem.url, "edit")}
                      />
                      <label htmlFor="" className="text-sm">
                        Редагування
                      </label>
                    </li>
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default Permissions
