export type Person = {
  name: string;
  group: string;
  semester: number;
  lectures: number;
  practical: number;
  laboratory: number;
  seminars: number;
  exams: number;
};

const range = (len: number) => {
  const arr: Array<number> = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  const cmks = ["ЗД", "ФД", "МБД", "ХД", "ГД"];
  const index = Math.floor(Math.random() * cmks.length - 1);
  return {
    name: "test lesson name " + Math.floor(Math.random() * 100),
    group: cmks[index],
    semester: Math.floor(Math.random() * 6),
    lectures: Math.floor(Math.random() * 100),
    practical: Math.floor(Math.random() * 100),
    laboratory: Math.floor(Math.random() * 100),
    seminars: Math.floor(Math.random() * 100),
    exams: Math.floor(Math.random() * 100),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
        // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
