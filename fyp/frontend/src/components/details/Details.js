import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getDetails, deleteDetail } from "../../actions/details";

export class Details extends Component {
  static propTypes = {
    details: PropTypes.array.isRequired,
    getDetails: PropTypes.func.isRequired,
    deleteDetail: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getDetails();
  }

  render() {
    return (
      <Fragment>
        <h2>Files</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>ASCII or Binary</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.details.map(detail => (
              <tr key={detail.id}>
                <td>{detail.id}</td>
                <td>{detail.name}</td>
                <td>{detail.STLfile}</td>
                <td>{detail.filename}</td>
                <td>
                  <button
                    onClick={this.props.deleteDetail.bind(this, detail.id)}
                    className="btn btn-danger btn-sm"
                  >
                    {" "}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  details: state.details.details
});

export default connect(
  mapStateToProps,
  { getDetails, deleteDetail }
)(Details);
