import { Variable, Implication, And, Not, Or } from "./api";

export default {
  axioms: [
    new Not(new Variable("Sunglasses")),
    new Not(new Variable("Umbrella")),
    new Implication(
      new And(new Variable("Rain"), new Not(new Variable("Umbrella"))),
      new Variable("Wet")
    ),
    new Or(new Variable("Rain"), new Variable("Sunny")),
    new Implication(
      new Variable("Rainbow"),
      new And(new Variable("Sunny"), new Variable("Rain"))
    ),
    new Implication(new Variable("Sunny"), new Variable("Sunglasses"))
  ],
  rules: [
    {
      name: "A; A => B |- B",
      requiredPremises: 2,
      transformation: theorems => {
        const [A, AiB] = theorems;
        if (AiB instanceof Implication) {
          const match = AiB.predicate1.toString() === A.toString();
          return match ? [AiB.predicate2] : [];
        }
        return [];
      }
    },
    {
      name: "A => B |- not A or B",
      requiredPremises: 1,
      transformation: theorems => {
        const [AiB] = theorems;
        if (AiB instanceof Implication) {
          return [new Or(new Not(AiB.predicate1), AiB.predicate2)];
        }
        return [];
      }
    },
    {
      name: "not B; A or B |- A",
      requiredPremises: 2,
      transformation: theorems => {
        const [nB, AoB] = theorems;
        if (nB instanceof Not && AoB instanceof Or) {
          const match1 = AoB.predicate2.toString() === nB.predicate.toString();
          if (match1) return [AoB.predicate1];
          const match2 = AoB.predicate1.toString() === nB.predicate.toString();
          if (match2) return [AoB.predicate2];
        }
        if (AoB instanceof Or) {
          if (AoB.predicate1 instanceof Not) {
            const match1 =
              AoB.predicate1.predicate.toString() === nB.toString();
            if (match1) return [AoB.predicate2];
          }
          if (AoB.predicate2 instanceof Not) {
            const match2 =
              AoB.predicate2.predicate.toString() === nB.toString();
            if (match2) return [AoB.predicate1];
          }
        }
        return [];
      }
    },
    {
      name: "A; B |- A and B",
      requiredPremises: 2,
      transformation: theorems => {
        const [A, B] = theorems;
        return [new And(A, B)];
      }
    },
    {
      name: "A and B |- A; B",
      requiredPremises: 1,
      transformation: theorems => {
        const [AnB] = theorems;
        if (AnB instanceof And) {
          console.log(AnB);
          return [AnB.predicate1, AnB.predicate2];
        }
        return [];
      }
    }
  ]
};
