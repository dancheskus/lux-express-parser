import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addUser, removeUser } from '../../actions/userActions';
import style from './cardStyle';

import ErrorIcon from './svg/ErrorIcon';
import SuccessIcon from './svg/SuccessIcon';
import ResetIcon from './svg/ResetIcon';

class CheckoutForm extends Component {
  initialState = {
    name: this.props.user.username,
    email: this.props.user.email,
    phone: '',
    submitting: false,
    submitted: false,
    errorMessage: '',
  };

  state = { ...this.initialState, amount: 300 };

  handleChange = e => {
    e.target.name === 'phone'
      ? this.setState({ phone: e.target.value.match(/^[+\d]?(?:[\d-.\s()]*)$/im) || this.state.phone })
      : this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ submitting: true });

    const { token } = await this.props.stripe.createToken({ name: this.state.name });

    this._element.clear();

    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/charge`, {
      stripeToken: token.id,
      userToken: localStorage.token,
      amount: this.state.amount,
      email: 'dancheskus@gmail.com',
    });
    this.props.addUser(response.data.user);
    if (response.statusText === 'OK') this.setState({ submitting: false, submitted: true });
  };

  resetButton = e => {
    e.preventDefault();
    this.setState(this.initialState);
    this.props.history.push('/');
  };

  render() {
    return (
      <div className="globalCheckoutContainer">
        <main>
          <div className="stripes">
            <div className="stripe s1" />
            <div className="stripe s2" />
            <div className="stripe s3" />
          </div>
          <section className="custom-container-lg">
            <div
              className={`cell example example1  ${this.state.submitting && 'submitting'} ${this.state.submitted &&
                'submitted'}`}
            >
              <form>
                <fieldset>
                  <div className="custom-row">
                    <label htmlFor="example1-name" data-tid="elements_examples.form.name_label">
                      Name
                    </label>
                    <input
                      id="example1-name"
                      data-tid="elements_examples.form.name_placeholder"
                      type="text"
                      placeholder={this.props.user.username}
                      required=""
                      autoComplete="name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="custom-row">
                    <label htmlFor="example1-email" data-tid="elements_examples.form.email_label">
                      Email
                    </label>
                    <input
                      id="example1-email"
                      data-tid="elements_examples.form.email_placeholder"
                      type="email"
                      placeholder={this.props.user.email}
                      required=""
                      autoComplete="email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="custom-row">
                    <label htmlFor="example1-phone" data-tid="elements_examples.form.phone_label">
                      Phone
                    </label>
                    <input
                      id="example1-phone"
                      data-tid="elements_examples.form.phone_placeholder"
                      type="tel"
                      placeholder="Enter your phone number"
                      required=""
                      autoComplete="tel"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.handleChange}
                    />
                  </div>
                </fieldset>
                <fieldset>
                  <div className="custom-row">
                    <CardElement
                      onReady={c => (this._element = c)}
                      style={style}
                      onChange={e => this.setState({ errorMessage: e.error ? e.error.message : '' })}
                    />
                  </div>
                </fieldset>
                <button type="submit" data-tid="elements_examples.form.pay_button" onClick={this.handleSubmit}>
                  Pay {this.state.amount / 100}€
                </button>
                <div className={`error ${this.state.errorMessage && 'visible'}`} role="alert">
                  <ErrorIcon />
                  <span className="message">{this.state.errorMessage}</span>
                </div>
              </form>
              <div className="success">
                <div className="icon">
                  <SuccessIcon />
                </div>
                <h3 className="title" data-tid="elements_examples.success.title">
                  Payment successful
                </h3>
                <p className="message">
                  <span data-tid="elements_examples.success.message">Thank you for your payment</span>
                </p>
                <div className="reset" onClick={this.resetButton}>
                  <ResetIcon />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  addUser: user => dispatch(addUser(user)),
  removeUser: () => dispatch(removeUser()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectStripe(CheckoutForm))
);
