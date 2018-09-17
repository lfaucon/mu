export default {
  axioms: ["MI"],
  rules: [
    {
      name: "xI -> xIU",
      transformation: theorem => {
        const match = theorem.match(/^(.*)I$/);
        return match ? [theorem + "U"] : [];
      }
    },
    {
      name: "Mx -> Mxx",
      transformation: theorem => {
        const match = theorem.match(/^M(.*)$/);
        return match ? [theorem + match[1]] : [];
      }
    },
    {
      name: "xIIIy -> xUy",
      transformation: theorem => {
        const n = theorem.length;
        return theorem
          .split("")
          .map((_, i) => {
            if (i < n - 2 && theorem.slice(i, i + 3) === "III") {
              return theorem.slice(0, i) + "U" + theorem.slice(i + 3);
            }
            return undefined;
          })
          .filter(x => !!x);
      }
    },
    {
      name: "xUUy -> xy",
      transformation: theorem => {
        const n = theorem.length;
        return theorem
          .split("")
          .map((_, i) => {
            if (i < n - 1 && theorem.slice(i, i + 2) === "UU") {
              return theorem.slice(0, i) + theorem.slice(i + 2);
            }
            return undefined;
          })
          .filter(x => !!x);
      }
    }
  ]
};
