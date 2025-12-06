import { useSelector } from "react-redux"
import { authSelector } from "@/store/auth/auth-slice"
import { UserRoles } from "@/store/auth/auth-types"

type PermissionResult = {
  canRead: boolean
  canEdit: boolean
}

export const usePermission = (pageUrl: string): PermissionResult => {
  const { user } = useSelector(authSelector)

  // If no user, no access
  if (!user) {
    return { canRead: false, canEdit: false }
  }

  // Check if user is Global Admin (based on role key 'ADMIN')
  const isAdmin = user.roles?.some((role) => role.key === UserRoles.ADMIN)
  if (isAdmin) {
    return { canRead: true, canEdit: true }
  }

  let canRead = false
  let canEdit = false

  // Iterate through all user roles
  const roles = user.roles || []
  roles.forEach((role) => {
    // Find permissions for the specific page
    const pagePermissions = role.permissions?.filter((p) => p.page === pageUrl)

    if (pagePermissions?.some((p) => p.action === "read")) {
      canRead = true
    }
    if (pagePermissions?.some((p) => p.action === "edit")) {
      canEdit = true
    }
  })

  // If user has 'edit' permission, they implicitly have 'read' permission
  if (canEdit) {
    canRead = true
  }

  return { canRead, canEdit }
}
