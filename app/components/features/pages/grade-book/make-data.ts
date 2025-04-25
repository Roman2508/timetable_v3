export type Person = {
  name: string;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "6": number;
  "7": number;
  "8": number;
  "9": number;
  "10": number;
  "11": number;
  "12": number;
  "13": number;
  "14": number;
  "15": number;
  "16": number;
  "17": number;
  "18": number;
  "19": number;
  "20": number;
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
    "1": Math.floor(Math.random() * 6),
    "2": Math.floor(Math.random() * 6),
    "3": Math.floor(Math.random() * 6),
    "4": Math.floor(Math.random() * 6),
    "5": Math.floor(Math.random() * 6),
    "6": Math.floor(Math.random() * 6),
    "7": Math.floor(Math.random() * 6),
    "8": Math.floor(Math.random() * 6),
    "9": Math.floor(Math.random() * 6),
    "10": Math.floor(Math.random() * 6),
    "11": Math.floor(Math.random() * 6),
    "12": Math.floor(Math.random() * 6),
    "13": Math.floor(Math.random() * 6),
    "14": Math.floor(Math.random() * 6),
    "15": Math.floor(Math.random() * 6),
    "16": Math.floor(Math.random() * 6),
    "17": Math.floor(Math.random() * 6),
    "18": Math.floor(Math.random() * 6),
    "19": Math.floor(Math.random() * 6),
    "20": Math.floor(Math.random() * 6),
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
