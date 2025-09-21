export type Person = {
  name: string;
  cmk: string;
  semester: number;
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
    cmk: cmks[index],
    semester: Math.floor(Math.random() * 6),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
      };
    });
  };

  return makeDataLevel();
}
