"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Building,
  User,
  Calendar,
  Blocks,
  Settings,
} from "lucide-react";

import { NavMain } from "~/components/features/sidebar/nav-main";
import { NavUser } from "~/components/features/sidebar/nav-user";
import { TeamSwitcher } from "~/components/features/sidebar/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "~/components/ui/common/sidebar";

// This is sample data.
export const navData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "./avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Структура",
      url: "#",
      icon: Blocks,
      isActive: true,
      items: [
        {
          title: "Групи",
          url: "/groups",
        },
        {
          title: "Потоки",
          url: "/streams",
        },
        {
          title: "Аудиторії",
          url: "/auditories",
        },
      ],
    },
    {
      title: "Навантаження",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Навчальні плани",
          url: "/plans",
        },
        {
          title: "Розподіл навантаження",
          url: "/distribution",
        },
        {
          title: "Перегляд навантаження",
          url: "#",
        },
      ],
    },
    {
      title: "Облікові записи",
      url: "#",
      icon: User,
      items: [
        {
          title: "Педагогічний склад",
          url: "/teachers",
        },
        {
          title: "Здобувачі освіти",
          url: "/students",
        },
        {
          title: "Поділ на підгрупи",
          url: "/students-divide",
        },
      ],
    },
    {
      title: "Розклад",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Редактор розкладу",
          url: "/timetable",
        },
        {
          title: "Автоматичне розставлення",
          url: "#",
        },
        {
          title: "Обмеження розкладу",
          url: "#",
        },
        {
          title: "Контроль вичитки",
          url: "#",
        },
        {
          title: "Мій розклад",
          url: "#",
        },
        {
          title: "Пошук вільної аудиторії",
          url: "#",
        },
      ],
    },
    {
      title: "Загальне",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Мій профіль",
          url: "/profile",
        },
        {
          title: "Вибіркові дисципліни",
          url: "#",
        },
        {
          title: "Електронний журнал",
          url: "/grade-book",
        },
      ],
    },
    {
      title: "Налаштування",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Налаштування",
          url: "/settings",
        },
        {
          title: "Статистика",
          url: "#",
        },
        {
          title: "Звіти",
          url: "#",
        },
        {
          title: "Документація",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
