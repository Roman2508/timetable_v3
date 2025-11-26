export const summaryTypes = [
  { label: "Тематична оцінка (ср.знач.)", value: "MODULE_AVERAGE" },
  { label: "Поточний рейтинг (сума)", value: "MODULE_SUM" },
  { label: "Семестрова оцінка (ср.знач.)", value: "LESSON_AVERAGE" },
  { label: "Рейтинг з дисципліни (сума)", value: "LESSON_SUM" },
  { label: "Модульний контроль", value: "MODULE_TEST" },
  { label: "Додатковий рейтинг", value: "ADDITIONAL_RATE" },
  { label: "Рейтинг з модуля", value: "CURRENT_RATE" }, // Підсумкова з дисципліни (100 бальна система) (сума)
  { label: "Екзамен", value: "EXAM" },
] as const
