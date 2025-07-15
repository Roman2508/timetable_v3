import {
  User,
  Blocks,
  Command,
  BookOpen,
  Settings,
  Calendar,
  Settings2,
  AudioWaveform,
  GalleryVerticalEnd,
} from "lucide-react";

export const navData = {
  user: {
    name: "Пташник Роман",
    email: "ptashnyk.roman@pharm.zt.ua",
    avatar: "./avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ЖБФФК",
      logo: GalleryVerticalEnd,
      plan: "ЖОР",
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
      key: "structure",
      icon: Blocks,
      isActive: false,
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
      key: "load",
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
          url: "/view-distribution-load",
        },
      ],
    },
    {
      title: "Облікові записи",
      key: "accounts",
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
      key: "timetable",
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
      key: "general",
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
        {
          title: "Навчально-метдичні комплекси",
          url: "/instructional-materials",
        },
        {
          title: "Індивідуальний план роботи викладача",
          url: "/individual-teacher-work",
        },
        {
          title: "Види педагогічної діяльності",
          url: "/teacher-activities-types",
        },
        {
          title: "Звіт викладача",
          url: "/teachers-report",
        },
        {
          title: "Моє педагогічне навантаження",
          url: "/my-teaching-load",
        },
      ],
    },
    {
      title: "Налаштування",
      key: "settings",
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
