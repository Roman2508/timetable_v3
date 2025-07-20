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
      id: "1",
      title: "Структура",
      key: "structure",
      icon: Blocks,
      items: [
        {
          id: "1",
          title: "Групи",
          url: "/groups",
        },
        {
          id: "2",
          title: "Потоки",
          url: "/streams",
        },
        {
          id: "3",
          title: "Аудиторії",
          url: "/auditories",
        },
      ],
    },
    {
      id: "2",
      title: "Навантаження",
      key: "load",
      icon: BookOpen,
      items: [
        {
          id: "4",
          title: "Навчальні плани",
          url: "/plans",
        },
        {
          id: "5",
          title: "Розподіл навантаження",
          url: "/distribution",
        },
        {
          id: "6",
          title: "Перегляд навантаження",
          url: "/view-distribution-load",
        },
      ],
    },
    {
      id: "3",
      title: "Облікові записи",
      key: "accounts",
      icon: User,
      items: [
        {
          id: "7",
          title: "Педагогічний склад",
          url: "/teachers",
        },
        {
          id: "8",
          title: "Здобувачі освіти",
          url: "/students",
        },
        {
          id: "9",
          title: "Поділ на підгрупи",
          url: "/students-divide",
        },
      ],
    },
    {
      id: "4",
      title: "Розклад",
      key: "timetable",
      icon: Calendar,
      items: [
        {
          id: "10",
          title: "Редактор розкладу",
          url: "/timetable",
        },
        {
          id: "11",
          title: "Автоматичне розставлення",
          url: "#",
        },
        {
          id: "12",
          title: "Обмеження розкладу",
          url: "#",
        },
        {
          id: "13",
          title: "Контроль вичитки",
          url: "#",
        },
        {
          id: "14",
          title: "Мій розклад",
          url: "#",
        },
        {
          id: "15",
          title: "Пошук вільної аудиторії",
          url: "#",
        },
      ],
    },
    {
      id: "5",
      title: "Загальне",
      key: "general",
      icon: Settings2,
      items: [
        {
          id: "16",
          title: "Мій профіль",
          url: "/profile",
        },
        {
          id: "17",
          title: "Вибіркові дисципліни",
          url: "#",
        },
        {
          id: "18",
          title: "Електронний журнал",
          url: "/grade-book",
        },
        {
          id: "19",
          title: "Навчально-метдичні комплекси",
          url: "/instructional-materials",
        },
        {
          id: "20",
          title: "Індивідуальний план роботи викладача",
          url: "/individual-teacher-work",
        },
        {
          id: "21",
          title: "Види педагогічної діяльності",
          url: "/teacher-activities-types",
        },
        {
          id: "22",
          title: "Звіт викладача",
          url: "/teachers-report",
        },
        {
          id: "23",
          title: "Моє педагогічне навантаження",
          url: "/my-teaching-load",
        },
      ],
    },
    {
      id: "6",
      title: "Налаштування",
      key: "settings",
      icon: Settings,
      items: [
        {
          id: "24",
          title: "Налаштування",
          url: "/settings",
        },
        {
          id: "25",
          title: "Статистика",
          url: "#",
        },
        {
          id: "26",
          title: "Звіти",
          url: "#",
        },
        {
          id: "27",
          title: "Документація",
          url: "#",
        },
      ],
    },
  ],
};
