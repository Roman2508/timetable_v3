import { LoadingStatusTypes } from "../app-types"

export type SettingsInitialStateType = {
  settings: SettingsType | null
  loadingStatus: LoadingStatusTypes
}

export type SettingsType = {
  id: number
  firstSemesterStart: string
  firstSemesterEnd: string
  secondSemesterStart: string
  secondSemesterEnd: string
  workDaysPerWeek: number
  callSchedule: {
    "1": {
      start: string
      end: string
    }
    "2": {
      start: string
      end: string
    }
    "3": {
      start: string
      end: string
    }
    "4": {
      start: string
      end: string
    }
    "5": {
      start: string
      end: string
    }
    "6": {
      start: string
      end: string
    }
    "7": {
      start: string
      end: string
    }
  }
  colors: {
    lectures: string
    practical: string
    laboratory: string
    seminars: string
    exams: string
    examsConsulation: string
  }
}
