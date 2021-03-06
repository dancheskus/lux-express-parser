import React, { Component } from 'react';
import { connect } from 'react-redux';
import SingleTicket from './SingleTicket';

class TicketPage extends Component {
  render() {
    return (
      <div>
        {this.props.tickets[0].response.length ? (
          <div>
            {this.props.tickets[0].response.map((value, key) => (
              <SingleTicket ticket={value} key={key} />
            ))}
          </div>
        ) : (
          <div>Нет акций в этом диапазоне</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
});

export default connect(mapStateToProps)(TicketPage);
