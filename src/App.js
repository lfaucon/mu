import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import vis from "vis";

import mu from "./mu";
import pq from "./pq";

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
    selected: 0,
    system: "pq",
    rules: []
  };

  componentDidMount() {
    this.makeNetwork(this.state.system);
  }

  changeSystem = system => {
    console.log(system);
    this.network.destroy();
    this.makeNetwork(system);
    this.setState({ system });
  };

  makeNetwork = system => {
    const { axioms, rules } = { mu, pq }[system];
    this.setState({ rules });
    // create an array with nodes
    this.nodes = new vis.DataSet(axioms.map(label => ({ label, id: label })));
    // create an array with edges
    this.edges = new vis.DataSet([]);

    // create a network
    const data = { nodes: this.nodes, edges: this.edges };
    const options = {
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 1, type: "arrow" }
        }
      }
    };
    const container = document.getElementById("network");
    this.network = new vis.Network(container, data, options);

    this.network.on("click", this.handleNetworkClick);
  };

  handleNetworkClick = params => {
    if (params.nodes.length > 0) {
      const ruleToApply = this.state.rules[this.state.selected];
      const newIds = ruleToApply.transformation(params.nodes[0]);
      this.nodes.update(newIds.map(id => ({ id, label: id })));
      const label = "Rule " + (this.state.selected + 1);
      this.edges.update(
        newIds.map(to => {
          const from = params.nodes[0];
          return { from, to, id: from + "->" + to, label };
        })
      );
      this.network.selectNodes([]);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <Rules
          selected={this.state.selected}
          rules={this.state.rules}
          system={this.state.system}
          setSelect={selected => this.setState({ selected })}
          setSystem={system => this.changeSystem(system)}
        />
        <Theorems />
      </div>
    );
  }
}

export default withStyles(styles)(App);
