export default {
  axioms: [
    "forall X: X = X",
    "forall X,Y: X = Y => Y = X",
    "forall X,Y,Z: X = Y and Y = Z => X = Z",
    "forall X,Y: X = Y => S(X) = S(Y)",
    "forall X,Y: S(X) = S(Y) => X = Y",
    "forall X: X + 0 = X",
    "forall X,Y: X + S(Y) = S(X + Y)"
  ],
  rules: [
    {
      name: "[ A and (A => B) ] => B",
      transformation: theorem => {
        return [];
      }
    },
    {
      name: "[ A = B and P(A) ] => P(B)",
      transformation: theorem => {
        return [];
      }
    },
    {
      name: "forall X: P(X) => P(0)",
      transformation: theorem => {
        const [forall, property] = theorem.split(":");
        return property ? [property.replace(/X/g, "0")] : [];
      }
    }
  ]
};
