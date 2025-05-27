const groups = ["група", "групи", "груп"];
const auditories = ["аудиторія", "аудиторії", "аудиторій"];
const teachers = ["викладач", "викладача", "викладачів"];

export const pluralizeWords = (number: number, type: "group" | "auditories" | "teachers") => {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;

  let forms = ["", "", ""];

  if (type === "group") {
    forms = groups;
  }

  if (type === "auditories") {
    forms = auditories;
  }

  if (type === "teachers") {
    forms = teachers;
  }

  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
};
