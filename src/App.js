import React, { Component } from "react";
import "./styles.css";
import Papa from "papaparse";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jumpersReady: false,
      firesReady: false,
      parsedJumpers: [],
      parsedFires: []
    };
  }

  handleRunClick = evnt => {
    if (this.state.firesReady && this.state.jumpersReady) {
      console.log("Ready!");
      this.addFiresToJumpers(this.state.parsedJumpers, this.state.parsedFires);
      this.exportData(this.state.parsedJumpers);
    } else if (!this.state.firesReady) {
      console.log("State: ", this.state);
      alert("Please upload a Fires CSV file");
    } else if (!this.state.jumpersReady) {
      console.log("State: ", this.state);
      alert("Please upload a Jumpers CSV file");
    }
  };

  addFiresToJumpers = (jumpers, fires) => {
    jumpers.map(jumper => (jumper.fires = "")); // add fires attribute to all jumpers

    fires.forEach(fire => {
      if (!fire["JUMPERS ON FIRE"]) {
        return;
      }
      fire["JUMPERS ON FIRE"].split(",").forEach(each => {
        let match = jumpers.find(e => {
          if (e["WEB NAME"]) {
            let jumperName = e["WEB NAME"].toLowerCase();
            let eachJumperInList = each.trim().toLowerCase();
            return jumperName === eachJumperInList;
          }
        });

        if (!!match && match.fires.length > 0) {
          console.log(
            "Match: ",
            match["WEB NAME"],
            "->",
            fire["JUMPERS ON FIRE"]
          );
          match.fires += "," + fire["UNIQUE-ID"];
        } else if (!!match && match.fires.length === 0) {
          match.fires += fire["UNIQUE-ID"];
        }
      });
    });
  };

  loadFires = evnt => {
    let file = evnt.target.files.item(0);

    if (file === null) {
      return;
    }

    console.log("File:", file);

    Papa.parse(file, {
      header: true,
      complete: (results, parser) => {
        this.setState({ parsedFires: results.data, firesReady: true });
      }
    });
  };

  loadJumpers = evnt => {
    let file = evnt.target.files.item(0);

    if (file === null) {
      return;
    }

    console.log("File:", file);

    Papa.parse(file, {
      header: true,
      complete: (results, parser) => {
        this.setState({ parsedJumpers: results.data, jumpersReady: true });
      }
    });
  };

  exportData = parsedData => {
    console.log(parsedData);
    let csvContent = "data:text/csv;charset=utf-8," + Papa.unparse(parsedData);
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    link.innerHTML = "<h1>Download CSV</h1>";
    document.body.appendChild(link);
  };

  render() {
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <div className="container">
          Fires:{" "}
          <input
            onChange={this.loadFires}
            type="file"
            name="fires"
            id="fires"
          />
          Jumpers:{" "}
          <input
            onChange={this.loadJumpers}
            type="file"
            name="jumpers"
            id="jumpers"
          />
        </div>
        <button onClick={this.handleRunClick}>Run</button>
      </div>
    );
  }
}
