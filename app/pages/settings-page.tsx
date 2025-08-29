import {
  Info as InfoIcon,
  Users as UsersIcon,
  ScanEye as ScanEyeIcon,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  ClipboardMinus as ClipboardMinusIcon,
} from "lucide-react"
import { useSearchParams } from "react-router"

import { RootContainer } from "~/components/layouts/root-container"
import RolesTab from "~/components/features/pages/settings/roles/roles-tab"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs"
import { OtherTab } from "~/components/features/pages/settings/other-tab"
import { AccountsTab } from "~/components/features/pages/settings/accounts-tab"
import { GeneralInfoTab } from "~/components/features/pages/settings/general-info-tab"
import { CallScheduleTab } from "~/components/features/pages/settings/call-schedule-tab"
import { EducationTermsTab } from "~/components/features/pages/settings/education-terms-tab"

const tabsList = [
  { icon: <InfoIcon />, label: "Загальна інформація", value: "general-info" },
  { icon: <CalendarIcon />, label: "Терміни навчання", value: "education-terms" },
  { icon: <ClipboardMinusIcon />, label: "Розклад дзвінків", value: "call-schedule" },
  { icon: <UsersIcon />, label: "Облікові записи", value: "accounts" },
  { icon: <ScanEyeIcon />, label: "Ролі", value: "roles" },
  { icon: <InfoIcon />, label: "Інше", value: "other" },
] as const

const tabs = {
  ["general-info"]: <GeneralInfoTab />,
  ["education-terms"]: <EducationTermsTab />,
  ["call-schedule"]: <CallScheduleTab />,
  ["accounts"]: <AccountsTab />,
  ["roles"]: <RolesTab />,
  ["other"]: <OtherTab />,
}

type TabsVariants = (typeof tabsList)[number]["value"]

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = (searchParams.get("tab") as TabsVariants) || tabsList[0].value

  return (
    <RootContainer classNames="mb-10 flex gap-8">
      <div className="w-70">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <SettingsIcon className="w-5" /> Налаштування
        </h2>

        <div className="sticky top-10">
          <Tabs
            value={activeTab}
            className="mb-4"
            orientation="vertical"
            onValueChange={(newValue) => setSearchParams({ tab: newValue })}
          >
            <TabsList className="flex gap-2 flex-col w-full h-full">
              {tabsList.map((el) => (
                <TabsTrigger
                  key={el.value}
                  value={el.value}
                  className="w-full py-3 flex justify-start border data-[state=active]:border-primary bg-sidebar"
                >
                  {el.icon} {el.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-[800px] w-full mx-auto">{tabs[activeTab]}</div>
    </RootContainer>
  )
}

export default SettingsPage
