import { ElectionConfig } from "./types";

export const DEFAULT_CONFIG: ElectionConfig = {
  electionName: "Bundestagswahl (Testmodus)",
  questions: [
    { id: "1", text: "Auf allen Autobahnen soll ein generelles Tempolimit von 130 km/h gelten.", category: "Mobilität" },
    { id: "2", text: "Die Vermögensteuer soll wieder erhoben werden.", category: "Steuern & Finanzen" },
    { id: "3", text: "Der Ausstieg aus der Kohleverstromung soll deutlich vor 2038 erfolgen.", category: "Klima & Umwelt" },
    { id: "4", text: "Der gesetzliche Mindestlohn soll auf mindestens 12 Euro erhöht werden.", category: "Wirtschaft & Arbeit" },
    { id: "5", text: "Das Wahlalter für Bundestagswahlen soll auf 16 Jahre gesenkt werden.", category: "Demokratie" },
    { id: "6", text: "Der kontrollierte Verkauf von Cannabis an Erwachsene soll legalisiert werden.", category: "Gesellschaft" },
    { id: "7", text: "Die Verteidigungsausgaben Deutschlands sollen auf mindestens 2 Prozent des Bruttoinlandsprodukts steigen.", category: "Außen & Sicherheit" },
    { id: "8", text: "Es soll ein bundesweiter und flächendeckender Mietendeckel eingeführt werden.", category: "Wohnen" },
    { id: "9", text: "Asylverfahren sollen nach Möglichkeit an den EU-Außengrenzen durchgeführt werden.", category: "Migration" },
    { id: "10", text: "Die Zulassung von neuen Autos mit Verbrennungsmotor soll ab 2035 verboten werden.", category: "Klima & Umwelt" }
  ],
  parties: [
    {
      id: "p1",
      name: "SPD",
      color: "#E3000F",
      answers: { "1": 1, "2": 1, "3": 0, "4": 1, "5": 1, "6": 1, "7": 0, "8": 0, "9": -1, "10": -1 },
      description: "Sozialdemokratische Partei Deutschlands - Setzt sich für soziale Gerechtigkeit, starke Arbeitnehmerrechte und einen sozialverträglichen Klimaschutz ein."
    },
    {
      id: "p2",
      name: "CDU/CSU",
      color: "#000000",
      answers: { "1": -1, "2": -1, "3": -1, "4": -1, "5": -1, "6": -1, "7": 1, "8": -1, "9": 1, "10": -1 },
      description: "Christlich Demokratische Union / Christlich-Soziale Union - Konservative Ausrichtung, Fokus auf innere Sicherheit, eine starke Wirtschaft und traditionelle Werte."
    },
    {
      id: "p3",
      name: "GRÜNE",
      color: "#46962b",
      answers: { "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 0, "8": 1, "9": -1, "10": 1 },
      description: "BÜNDNIS 90/DIE GRÜNEN - Ökologische Ausrichtung, fordert den Klimaschutz, die Energiewende und eine progressive Gesellschaftspolitik."
    },
    {
      id: "p4",
      name: "FDP",
      color: "#FFED00",
      answers: { "1": -1, "2": -1, "3": -1, "4": -1, "5": 1, "6": 1, "7": 1, "8": -1, "9": 0, "10": -1 },
      description: "Freie Demokratische Partei - Liberale Politik, fokussiert sich auf individuelle Freiheit, Marktwirtschaft, Steuersenkungen und Digitalisierung."
    },
    {
      id: "p5",
      name: "AfD",
      color: "#009EE0",
      answers: { "1": -1, "2": -1, "3": -1, "4": -1, "5": -1, "6": -1, "7": 1, "8": -1, "9": 1, "10": -1 },
      description: "Alternative für Deutschland - Bürgerliche und Rechte Positionen, fordert eine restriktive Migrationspolitik und lehnt viele Klimaschutzmaßnahmen ab."
    }
  ]
};
