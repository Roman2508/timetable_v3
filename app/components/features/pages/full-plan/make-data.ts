export type Person = {
  name: string;
  totalHours: number;
  semester_1: number;
  semester_2: number;
  semester_3: number;
  semester_4: number;
  semester_5: number;
  semester_6: number;
};

const range = (len: number) => {
  const arr: Array<number> = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  return {
    name: "test lesson name " + Math.floor(Math.random() * 100),
    totalHours: Math.floor(Math.random() * 100),
    semester_1: Math.floor(Math.random() * 100),
    semester_2: Math.floor(Math.random() * 100),
    semester_3: Math.floor(Math.random() * 100),
    semester_4: Math.floor(Math.random() * 100),
    semester_5: Math.floor(Math.random() * 100),
    semester_6: Math.floor(Math.random() * 100),
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
