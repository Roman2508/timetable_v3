export type Person = {
  name: string;
  login: string;
  password: string;
  email: string;
  status: string;
  group: string;
};

const range = (len: number) => {
  const arr: Array<number> = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  const statusList = ["Навчається", "Відраховано", "Академічна відпустка"];
  const index1 = Math.floor(Math.random() * statusList.length);
  const groups = ["PH9-25-1", "PH9-24-2", "LD9-23-1", "PHe11-23-1"];
  const index2 = Math.floor(Math.random() * groups.length);
  return {
    name: "Test Student Name" + Math.floor(Math.random() * 100),
    login: "test.student" + Math.floor(Math.random() * 100),
    password: "11111111",
    email: "test.email" + Math.floor(Math.random() * 100) + "@pharm.zt.ua",
    status: statusList[index1],
    group: groups[index2],
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
