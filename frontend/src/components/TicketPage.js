import React, { Component } from 'react';
import { connect } from 'react-redux';

class TicketPage extends Component {
  render() {
    return (
      <div>
        {/* {this.props.tickets[0].response.map((link, el) => (
          <h2 key={el}>{link}</h2>
        ))} */}

        {console.log(this.props.tickets[0].response)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
});

export default connect(mapStateToProps)(TicketPage);
