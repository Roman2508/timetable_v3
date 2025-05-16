export type Person = {
  name: string;
  category: string;
  course: number;
  students: number;
  formOfEducation: string;
  status: string;
};

const range = (len: number) => {
  const arr: Array<number> = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  const statusList = ["Активна", "Архів"];
  const index = Math.floor(Math.random() * statusList.length);
  return {
    name: "PH9-25-" + Math.floor(Math.random() * 100),
    category: "Фармацевтичне" + Math.floor(Math.random() * 100),
    course: Math.floor(Math.random() * 3),
    students: Math.floor(Math.random() * 30),
    formOfEducation: "Денна",
    status: statusList[index],
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return newPerson();
    });
  };

  return makeDataLevel();
}
