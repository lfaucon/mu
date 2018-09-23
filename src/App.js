import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import vis from "vis";

import mu from "./mu";
import pq from "./pq";
import peano from "./peano";
import logic from "./logic";

const styles = () => ({
  main: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  rulesContainer: {
    marginTop: "20px"
  },
  rule: {
    margin: "5px"
  },
  container: {
    flex: "1 1 0px",
    margin: "20px",
    width: "90%",
    border: "solid 2px black"
  },
  network: {
    width: "100%",
    height: "100%"
  }
});

const Rules = withStyles(styles)(
  ({ classes, rules, selected, setSelect, system, setSystem }) => (
    <div className={classes.rulesContainer}>
      <Select value={system} onChange={e => setSystem(e.target.value)}>
        <MenuItem value="mu">MU</MenuItem>
        <MenuItem value="pq">PQ</MenuItem>
        <MenuItem value="peano">Peano</MenuItem>
        <MenuItem value="logic">Logic</MenuItem>
      </Select>
      {rules.map(({ name, transformation }, idx) => (
        <Button
          key={name}
          variant="contained"
          color={selected === idx ? "primary" : "default"}
          onClick={() => setSelect(idx)}
          className={classes.rule}
        >
          {name}
        </Button>
      ))}
    </div>
  )
);

const Theorems = withStyles(styles)(({ classes }) => (
  <div className={classes.container}>
    <div className={classes.network} id="network" />
  </div>
));

class App extends React.Component {
  state = {
    selected: -1,
    system: "logic",
    rules: []
  };

  componentDidMount() {
    this.makeNetwork(this.state.system);
  }

  changeSystem = system => {
    console.log(system);
    this.network.destroy();
    this.makeNetwork(system);
    this.setState({ system, selected: -1 });
  };

  makeNetwork = system => {
    const { axioms, rules } = { mu, pq, peano, logic }[system];
    this.setState({ rules });
    // create an array with nodes
    this.nodes = new vis.DataSet(
      axioms
        .map(a => a.toString())
        .map(label => ({ label, id: label, color: "#77cc77" }))
    );
    this.theorems = [...axioms];

    // create an array with edges
    this.edges = new vis.DataSet([]);

    // create a network
    const data = { nodes: this.nodes, edges: this.edges };
    const options = {
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 1, type: "arrow" }
        }
      },
      nodes: {
        shape: "box",
        margin: 16
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -5000,
          springLength: 250,
          springConstant: 0.1
        }
      }
    };
    const container = document.getElementById("network");
    this.network = new vis.Network(container, data, options);
    this.network.on("click", this.handleNetworkClick);
  };

  handleNetworkClick = params => {
    if (!this.selectedNodes) return;
    if (params.nodes.length > 0) {
      const selectedRule = this.state.rules[this.state.selected];
      if (!selectedRule) return;
      const { requiredPremises, transformation } = selectedRule;
      if (this.selectedNodes && this.selectedNodes.length < requiredPremises) {
        this.selectedNodes.push(
          this.theorems.find(x => x.toString() === params.nodes[0])
        );
      }
      if (this.selectedNodes.length == requiredPremises) {
        console.log("HELLO");
        const newTheorems = transformation(this.selectedNodes);
        console.log(newTheorems);
        newTheorems.forEach(t => {
          console.log(t);
          console.log(this.theorems);
          const isNew = !this.theorems.find(x => x.toString() === t.toString());
          if (isNew) this.theorems.push(t);
        });
        const newIds = newTheorems.map(t => t.toString());
        this.nodes.update(newIds.map(id => ({ id, label: id })));

        const label = "Rule " + (this.state.selected + 1);
        this.selectedNodes.forEach(t =>
          this.edges.update(
            newTheorems.map(newT => {
              const from = t.toString();
              const to = newT.toString();
              return { from, to, id: from + "->" + to, label };
            })
          )
        );

        this.network.selectNodes([]);
        this.setState({ selected: -1 });
        this.selectedNodes = [];
      }
    }
  };

  handleSelectRule = selected => {
    this.setState({ selected });
    this.selectedNodes = [];
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <Rules
          selected={this.state.selected}
          rules={this.state.rules}
          system={this.state.system}
          setSelect={this.handleSelectRule}
          setSystem={system => this.changeSystem(system)}
        />
        <Theorems />
      </div>
    );
  }
}

export default withStyles(styles)(App);
