import React, { Component } from "react";
import { STLViewer } from 'react-stl-obj-viewer'; //react viewr component
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addLead } from "../../actions/leads";

export class Form extends Component {
  constructor() {
    super();
    this.state = {
      stlFile: null,
    };
  }




  static propTypes = {
    addLead: PropTypes.func.isRequired
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { name, STLfile, filename, datafile } = this.state;
    const lead = { name, STLfile, filename, datafile };
    this.props.addLead(lead);
    this.setState({
      name: "",
      STLfile: "",
      filename: "",
      datafile: "",
    });
  };


  render() {
    const { name, STLfile, filename, datafile } = this.state;
    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Add STL file</h2>
        <form onSubmit={this.onSubmit}>
          <div className="App">
            <div className="form-group">
              <label>Name of File</label>
              <input
                className="form-control"
                type="text"
                name="name"
                onChange={this.onChange}
                value={name}
              />
            </div>
            <div className="form-group">
              <label>Is this ASCII or Binary?</label>
              <input
                className="form-control"
                type="text"
                name="STLfile"
                onChange={this.onChange}
                value={STLfile}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                className="form-control"
                type="text"
                name="filename"
                onChange={this.onChange}
                value={filename}
              />
            </div>
            <div className="form-group" id="div2">
              <label htmlFor="obj-file">
                        <br />
                <input type="file"
                    name="datafile"
                    onChange={(e) => {
                    console.log(e.target.files)
                    this.setState({
                      stlFile: e.target.files[0]
                    }
                  )
                  }
                }
                  value={datafile}
                />
              </label>
              {this.state.stlFile ?
                <STLViewer
                  onSceneRendered={(element) => {
                    console.log(element)
                  }}
                  sceneClassName="test-scene"
                  file={this.state.stlFile}
                  className="obj"
                  modelColor="#909090" /> : null
                }

                <br></br>
                <div className="form-group">
                    <button onClick={(e) => {
                      console.log(e.target.files)
                      this.setState({
                        stlFile: null
                      })
                    }} type="reset" className="btn btn-danger">
                      Reset
                  </button> &nbsp;&nbsp;&nbsp;
                      <button type="submit" className="btn btn-primary">  
                      Submit 
                    </button>

              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  null,
  { addLead }
)(Form);
