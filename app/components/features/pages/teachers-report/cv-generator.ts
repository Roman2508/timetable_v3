import { Table, TextRun, TableRow, Document, WidthType, TableCell, Paragraph, AlignmentType } from "docx";
import type { GroupLoadType } from "~/store/groups/groups-types";
import type { TeacherReportType } from "~/store/teacher-profile/teacher-profile-types";

type AlignmentType =
  | "start"
  | "center"
  | "end"
  | "both"
  | "mediumKashida"
  | "distribute"
  | "numTab"
  | "highKashida"
  | "lowKashida"
  | "thaiDistribute"
  | "left"
  | "right"
  | undefined;

export class DocumentCreator {
  // tslint:disable-next-line: typedef
  public create(
    firstSemesterLessons: GroupLoadType[][],
    secondSemesterLessons: GroupLoadType[][],
    methodicalWork: TeacherReportType[],
    scientificWork: TeacherReportType[],
    organizationalWork: TeacherReportType[],
    teacherName: string,
    reportYear: number,
  ): Document {
    const document = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1134,
                bottom: 1134,
                right: 850,
                left: 850,
              },
            },
          },
          children: [
            this.createParagraph("Затверджую", "right", 24),
            this.createParagraph("заступник директора з навчальної роботи", "right", 24),
            this.createParagraph("________________________ Луцак Ірина Василівна", "right", 24, false, {
              before: 0,
              after: 480,
            }),

            this.createParagraph("Житомирський базовий фармацевтичний фаховий коледж", "center", 28, true),
            this.createParagraph("Житомирської обласної ради", "center", 28, true, {
              before: 0,
              after: 240,
            }),
            this.createParagraph("Циклова комісія_______________________________________________", "center", 24, true, {
              before: 0,
              after: 240,
            }),
            this.createParagraph("ІНДИВІДУАЛЬНИЙ ПЛАН РОБОТИ ВИКЛАДАЧА ТА ЇЇ ОБЛІК", "center", 28, true),
            this.createParagraph(String(teacherName), "center", 28, true),
            this.createParagraph(`на ${reportYear} - ${reportYear + 1} н.р.`, "center", 28, false, {
              before: 360,
              after: 240,
            }),

            /*  */

            new Table({
              width: {
                size: 100, // 100% width
                type: WidthType.PERCENTAGE,
              },
              margins: { bottom: 240 },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [this.createParagraph("Посада", "left", 24)],
                      margins: { top: 10, bottom: 10, left: 20 },
                    }),
                    new TableCell({
                      children: [this.createParagraph("Науковий ступінь", "left", 24)],
                      margins: { top: 10, bottom: 10, left: 20 },
                    }),
                    new TableCell({
                      children: [this.createParagraph("Вчене звання", "left", 24)],
                      margins: { top: 10, bottom: 10, left: 20 },
                    }),
                    new TableCell({
                      children: [this.createParagraph("Ставка або її частина", "left", 24)],
                      margins: { top: 10, bottom: 10, left: 20 },
                    }),
                    new TableCell({
                      children: [this.createParagraph("Примітка", "left", 24)],
                      margins: { top: 10, bottom: 10, left: 20 },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [this.createParagraph(" ", "left", 24)],
                      margins: { top: 40, bottom: 40 },
                    }),
                    new TableCell({
                      children: [this.createParagraph(" ", "left", 24)],
                      margins: { top: 40, bottom: 40 },
                    }),
                    new TableCell({
                      children: [this.createParagraph(" ", "left", 24)],
                      margins: { top: 40, bottom: 40 },
                    }),
                    new TableCell({
                      children: [this.createParagraph(" ", "left", 24)],
                      margins: { top: 40, bottom: 40 },
                    }),
                    new TableCell({
                      children: [this.createParagraph(" ", "left", 24)],
                      margins: { top: 40, bottom: 40 },
                    }),
                  ],
                }),
              ],
            }),

            /*  */

            this.createParagraph(`НАВЧАЛЬНА РОБОТА НА ${reportYear}-${reportYear + 1} н.р.`, "center", 28, true, {
              before: 360,
              after: 240,
            }),

            /*  */

            new Table({
              width: {
                size: 100, // 100% width
                type: WidthType.PERCENTAGE,
              },
              margins: { top: 10, bottom: 10, left: 20, right: 20 },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [this.createTableParagraph("№"), this.createTableParagraph("з/п")],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Назва"),
                        this.createTableParagraph("навчальних"),
                        this.createTableParagraph("дисципліни"),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Шифр"),
                        this.createTableParagraph("груп"),
                        this.createTableParagraph("(потоків)"),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [this.createTableParagraph("Читання"), this.createTableParagraph("лекцій")],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Проведення"),
                        this.createTableParagraph("практичних"),
                        this.createTableParagraph("занять"),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Проведення"),
                        this.createTableParagraph("лабораторних"),
                        this.createTableParagraph("занять"),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Проведення"),
                        this.createTableParagraph("семінарських"),
                        this.createTableParagraph("занять"),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Проведення"),
                        this.createTableParagraph("індивідуальних"),
                        this.createTableParagraph("занять"),
                      ],
                      verticalAlign: "center",
                    }),
                  ],
                }),

                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph("1")] }),
                    new TableCell({ children: [this.createTableParagraph("2")] }),
                    new TableCell({ children: [this.createTableParagraph("3")] }),
                    new TableCell({ children: [this.createTableParagraph("4")] }),
                    new TableCell({ children: [this.createTableParagraph("5")] }),
                    new TableCell({ children: [this.createTableParagraph("6")] }),
                    new TableCell({ children: [this.createTableParagraph("7")] }),
                    new TableCell({ children: [this.createTableParagraph("8")] }),
                  ],
                }),

                ...this.createTableLessons(firstSemesterLessons),
                this.createTableSemesterSummary(firstSemesterLessons, "semester_1"),

                ...this.createTableLessons(secondSemesterLessons),
                this.createTableSemesterSummary(secondSemesterLessons, "semester_2"),

                this.createTableSemesterSummary([...firstSemesterLessons, ...secondSemesterLessons], "year"),

                //
              ],
            }),

            /*  */

            this.createParagraph(
              'Затверджено на засіданні кафедри, циклової комісії "_____" _____________________ ',
              "both",
              28,
              false,
              {
                before: 240,
                after: 80,
              },
            ),

            this.createParagraph("20____ року. Протокол № _____________", "both", 28, false, {
              before: 0,
              after: 360,
            }),

            this.createParagraph("Методична робота", "center", 28, true, { before: 0, after: 240 }),
            this.createReportTable(methodicalWork),

            /*  */

            this.createParagraph("Наукова робота", "center", 28, true, { before: 360, after: 240 }),
            this.createReportTable(scientificWork),

            /*  */

            this.createParagraph("Організаційна робота", "center", 28, true, { before: 360, after: 240 }),
            this.createReportTable(organizationalWork),

            /*  */

            this.createParagraph(
              "____________________________________________________Голова циклової комісії",
              "both",
              28,
              false,
              { before: 240, after: 80 },
            ),

            this.createParagraph("____________________________________________________Викладач", "both", 28, false, {
              before: 0,
              after: 360,
            }),

            this.createParagraph("ПЕРЕЛІК ЗМІН У ПЛАНІ РОБОТИ ВИКЛАДАЧА", "center", 28, true, {
              before: 0,
              after: 240,
            }),

            /*  */

            new Table({
              width: {
                size: 100, // 100% width
                type: WidthType.PERCENTAGE,
              },
              margins: { top: 10, bottom: 10, left: 20, right: 20 },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [this.createTableParagraph("Дата, вид"), this.createTableParagraph("робіт")],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Зміст внесених змін та їх"),
                        this.createTableParagraph("обґрунтування"),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Підпис завідувача кафедри,"),
                        this.createTableParagraph("голови циклової комісії"),
                      ],
                      verticalAlign: "center",
                    }),
                  ],
                }),

                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph("1")] }),
                    new TableCell({ children: [this.createTableParagraph("2")] }),
                    new TableCell({ children: [this.createTableParagraph("3")] }),
                  ],
                }),

                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
              ],
            }),

            /*  */

            this.createParagraph("ЗАУВАЖЕННЯ ОСІБ, ЯКІ ПЕРЕВІРЯЮТЬ РОБОТУ ЦИКЛОВОЇ КОМІСІЇ", "center", 28, true, {
              before: 360,
              after: 240,
            }),

            /*  */

            new Table({
              width: {
                size: 100, // 100% width
                type: WidthType.PERCENTAGE,
              },
              margins: { top: 10, bottom: 10, left: 20, right: 20 },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [this.createTableParagraph("Дата, вид"), this.createTableParagraph("робіт")],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Зміст внесених змін та їх"),
                        this.createTableParagraph("обґрунтування"),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        this.createTableParagraph("Підпис завідувача кафедри,"),
                        this.createTableParagraph("голови циклової комісії"),
                      ],
                      verticalAlign: "center",
                    }),
                  ],
                }),

                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph("1")] }),
                    new TableCell({ children: [this.createTableParagraph("2")] }),
                    new TableCell({ children: [this.createTableParagraph("3")] }),
                  ],
                }),

                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                    new TableCell({ children: [this.createTableParagraph(" ")] }),
                  ],
                }),
              ],
            }),

            /*  */

            this.createParagraph("", "center", 28, true, {
              before: 0,
              after: 240,
            }),

            /*  */
          ],
        },
      ],
    });

    return document;
  }

  public createContactInfo(phoneNumber: string, profileUrl: string, email: string): Paragraph {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun(`Mobile: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`),
        new TextRun({
          text: "Address: 58 Elm Avenue, Kent ME4 6ER, UK",
          break: 1,
        }),
      ],
    });
  }

  public createParagraph(
    text: string,
    alignment: AlignmentType,
    size: number,
    bold?: boolean,
    spacing?: {
      before: number;
      after: number;
    },
  ): Paragraph {
    return new Paragraph({
      alignment,
      children: [
        new TextRun({
          text,
          font: "Times New Roman",
          size,
          bold: !!bold,
        }),
      ],
      spacing: spacing
        ? spacing
        : {
            before: 0,
            after: 0,
          },
    });
  }

  public createTableParagraph(text: string, alignment: AlignmentType = "center"): Paragraph {
    return new Paragraph({
      alignment,
      children: [
        new TextRun({
          text,
          font: "Times New Roman",
          size: 24,
        }),
      ],
    });
  }

  public createTableLessons(lessons: GroupLoadType[][]): TableRow[] {
    return lessons.map((el, index) => {
      const lectures = el.find((el) => el.typeRu === "ЛК");
      const practical = el.find((el) => el.typeRu === "ПЗ");
      const laboratory = el.find((el) => el.typeRu === "ЛАБ");
      const seminars = el.find((el) => el.typeRu === "СЕМ");
      const exams = el.find((el) => el.typeRu === "ЕКЗ");

      return new TableRow({
        children: [
          new TableCell({ children: [this.createTableParagraph(String(index + 1))] }),
          new TableCell({ children: [this.createTableParagraph(el[0].name, "left")] }),
          new TableCell({ children: [this.createTableParagraph(el[0].group.name)] }),
          new TableCell({ children: [this.createTableParagraph(lectures ? String(lectures.hours) : "")] }),
          new TableCell({
            children: [this.createTableParagraph(practical ? String(practical.hours) : "")],
          }),
          new TableCell({
            children: [this.createTableParagraph(laboratory ? String(laboratory.hours) : "")],
          }),
          new TableCell({ children: [this.createTableParagraph(seminars ? String(seminars.hours) : "")] }),
          new TableCell({ children: [this.createTableParagraph(exams ? String(exams.hours) : "")] }),
        ],
      });
    });
  }

  public createTableSemesterSummary(lessons: GroupLoadType[][], type: "semester_1" | "semester_2" | "year"): TableRow {
    const getTotalHours = (type: "ЛК" | "ПЗ" | "ЛАБ" | "СЕМ" | "ЕКЗ" | "КОНС" | "МЕТОД"): number => {
      const total = lessons.reduce((acc, cur) => {
        const lesson = cur.find((el) => el.typeRu === type);
        if (lesson) return lesson.hours + acc;
        return acc;
      }, 0);

      return total;
    };

    const label =
      type === "semester_1"
        ? "Разом за I семестр"
        : type === "semester_2"
        ? "Разом за II семестр"
        : "Разом за навчальний рік";

    const totalLectures = getTotalHours("ЛК");
    const totalPracticals = getTotalHours("ПЗ");
    const totalLaboratory = getTotalHours("ЛАБ");
    const totalSeminars = getTotalHours("СЕМ");
    const totalExams = getTotalHours("ЕКЗ");

    return new TableRow({
      children: [
        new TableCell({ children: [this.createTableParagraph(label)], columnSpan: 3 }),
        new TableCell({ children: [this.createTableParagraph(String(totalLectures))] }),
        new TableCell({ children: [this.createTableParagraph(String(totalPracticals))] }),
        new TableCell({ children: [this.createTableParagraph(String(totalLaboratory))] }),
        new TableCell({ children: [this.createTableParagraph(String(totalSeminars))] }),
        new TableCell({ children: [this.createTableParagraph(String(totalExams))] }),
      ],
    });
  }

  public createReportTable(reports: TeacherReportType[]): Table {
    return new Table({
      width: {
        size: 100, // 100% width
        type: WidthType.PERCENTAGE,
      },
      margins: { top: 10, bottom: 10, left: 20, right: 20 },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [this.createTableParagraph("№")],
              verticalAlign: "center",
            }),
            new TableCell({
              children: [this.createTableParagraph("Види робіт")],
              verticalAlign: "center",
            }),
            new TableCell({
              children: [this.createTableParagraph("К-ть "), this.createTableParagraph("годин")],
              verticalAlign: "center",
            }),
            new TableCell({
              children: [this.createTableParagraph("Зміст роботи")],
              verticalAlign: "center",
            }),
            new TableCell({
              children: [this.createTableParagraph("Термін"), this.createTableParagraph("виконання")],
              verticalAlign: "center",
            }),
            new TableCell({
              children: [
                this.createTableParagraph("Позначка"),
                this.createTableParagraph("про"),
                this.createTableParagraph("виконання"),
              ],
              verticalAlign: "center",
            }),
          ],
        }),

        ...reports.map((el, index) => {
          return new TableRow({
            children: [
              new TableCell({ children: [this.createTableParagraph(String(index + 1))] }),
              new TableCell({
                children: [this.createTableParagraph(el.individualWork.name, "left")],
              }),
              new TableCell({ children: [this.createTableParagraph(String(el.hours))] }),
              new TableCell({ children: [this.createTableParagraph(el.description, "left")] }),
              new TableCell({ children: [this.createTableParagraph(el.plannedDate)] }),
              new TableCell({ children: [this.createTableParagraph("Виконано")] }),
            ],
          });
        }),
      ],
    });
  }
}
