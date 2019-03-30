import React, { Component } from "react";
import { STLViewer } from 'react-stl-obj-viewer';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addLead } from "../../actions/leads";

export class Form extends Component {
  constructor() {
    super();
    this.state = {
      message: null,
    };
  }




  static propTypes = {
    addLead: PropTypes.func.isRequired
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { name, email, message } = this.state;
    const lead = { name, email, message };
    this.props.addLead(lead);
    this.setState({
      name: "",
      email: "",
      message: "",
    });
  };


  render() {
    const { name, email, message } = this.state;
    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Add STL file to database</h2>
        <form onSubmit={this.onSubmit}>
          <div className="App">
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                onChange={this.onChange}
                value={name}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                onChange={this.onChange}
                value={email}
              />
            </div>
            <div className="form-group" id="div2">
              <label htmlFor="obj-file">
                Load STL by file
                        <br />
                <input type="file"
                  name="file"
                    onChange={(e) => {
                    console.log(e.target.files)
                    this.setState({
                      stlFile: e.target.files[0]
                    }
                  )
                  }}
                  value = {message}
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
              
              <div className="form-group">
              <button onClick={(e) => {
                console.log(e.target.files)
                this.setState({
                  stlFile: null
                })
              }} type="reset" className="btn btn-danger">
                Reset
            </button>
            </div>

            <div className="form-group">
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