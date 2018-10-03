import React, { Component } from 'react';
import { connect } from 'react-redux';

class SingleTicket extends Component {
  render() {
    // const {
    //   date: aToBdate,
    //   totalPrice: aToBtotalPrice,
    //   TripId: aToBTripId,
    //   DepartureRouteStopId: aToBDepartureRouteStopId,
    //   DestinationRouteStopId: aToBDestinationRouteStopId,
    // } = this.props.ticket.aToB;

    // const {
    //   date: bToAdate,
    //   totalPrice: bToAtotalPrice,
    //   TripId: bToATripId,
    //   DepartureRouteStopId: bToADepartureRouteStopId,
    //   DestinationRouteStopId: bToADestinationRouteStopId,
    // } = this.props.ticket.bToA;

    return (
      <div>
        <div>
          <h3>Туда</h3>
          <div>Дата: {this.props.ticket.aToB.date}</div>
          <div>Цена: {this.props.ticket.aToB.totalPrice}</div>
          <div>
            <a
              href={`https://ticket.luxexpress.eu/en/reisi-info/about-trip?TripId=
            ${this.props.ticket.aToB.TripId}
            &DepartureId=
            ${this.props.ticket.aToB.DepartureRouteStopId}
            &DestinationId=
            ${this.props.ticket.aToB.DestinationRouteStopId}
            &PriceIndicator=Campaign`}
              target="#"
            >
              Подробнее
            </a>
          </div>
        </div>

        {Object.entries(this.props.ticket).length > 1 ? (
          <div>
            <h3>Обратно</h3>
            <div>Дата: {this.props.ticket.bToA.date}</div>
            <div>Цена: {this.props.ticket.bToA.totalPrice}</div>
            <div>
              <a
                href={`https://ticket.luxexpress.eu/en/reisi-info/about-trip?TripId=
            ${this.props.ticket.bToA.TripId}
            &DepartureId=
            ${this.props.ticket.bToA.DepartureRouteStopId}
            &DestinationId=
            ${this.props.ticket.bToA.DestinationRouteStopId}
            &PriceIndicator=Campaign`}
                target="#"
              >
                Подробнее
              </a>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
});

export default connect(mapStateToProps)(SingleTicket);
