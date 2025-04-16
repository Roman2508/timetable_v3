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
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
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
          url: "#",
        },
        {
          title: "Потоки",
          url: "#",
        },
        {
          title: "Аудиторії",
          url: "#",
        },
      ],
    },
    {
      title: "Навантаження",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Потоки",
          url: "#",
        },
        {
          title: "Розподіл навантаження",
          url: "#",
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
          url: "#",
        },
        {
          title: "Здобувачі освіти",
          url: "#",
        },
        {
          title: "Поділ на підгрупи",
          url: "#",
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
          url: "#",
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
      title: "Загальні відомості",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Мій профіль",
          url: "#",
        },
        {
          title: "Вибіркові дисципліни",
          url: "#",
        },
        {
          title: "Електронний журнал",
          url: "#",
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
          url: "#",
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
