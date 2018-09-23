export class Variable {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

export class Implication {
  constructor(predicate1, predicate2) {
    this.predicate1 = predicate1;
    this.predicate2 = predicate2;
  }

  toString() {
    return (
      "( " +
      this.predicate1.toString() +
      " ) => ( " +
      this.predicate2.toString() +
      " )"
    );
  }
}

export class And {
  constructor(predicate1, predicate2) {
    this.predicate1 = predicate1;
    this.predicate2 = predicate2;
  }

  toString() {
    return (
      "( " +
      this.predicate1.toString() +
      " ) and ( " +
      this.predicate2.toString() +
      " )"
    );
  }
}

export class Or {
  constructor(predicate1, predicate2) {
    this.predicate1 = predicate1;
    this.predicate2 = predicate2;
  }

  toString() {
    return (
      "( " +
      this.predicate1.toString() +
      " ) or ( " +
      this.predicate2.toString() +
      " )"
    );
  }
}

export class Not {
  constructor(predicate) {
    this.predicate = predicate;
  }

  toString() {
    return "not ( " + this.predicate.toString() + " )";
  }
}
