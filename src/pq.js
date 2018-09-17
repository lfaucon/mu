export default {
  axioms: ["Q"],
  rules: [
    {
      name: "xQy -> yQx",
      transformation: theorem => {
        const match = theorem.match(/^(.*)Q(.*)$/);
        return match ? [match[2] + "Q" + match[1]] : [];
      }
    },
    {
      name: "x -> Px",
      transformation: theorem => ["P" + theorem]
    },
    {
      name: "xQy -> UxQUy",
      transformation: theorem => {
        const match = theorem.match(/^(.*)Q(.*)$/);
        return match ? ["U" + match[1] + "QU" + match[2]] : [];
      }
    }
  ]
};
