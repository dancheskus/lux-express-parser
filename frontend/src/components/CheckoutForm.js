import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';

const style = {
  base: {
    iconColor: '#c4f0ff',
    color: '#fff',
    fontWeight: 500,
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    fontSize: '16px',
    fontSmoothing: 'antialiased',

    ':-webkit-autofill': {
      color: '#fce883',
    },
    '::placeholder': {
      color: '#87BBFD',
    },
  },
  invalid: {
    iconColor: '#FFC7EE',
    color: '#FFC7EE',
  },
};

class CheckoutForm extends Component {
  state = { name: '', email: '', phone: '', amount: 300, submitting: false, submitted: false, errorMessage: '' };

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
      token: token.id,
      amount: this.state.amount,
      email: 'dancheskus@gmail.com',
    });
    if (response.statusText === 'OK') this.setState({ submitting: false, submitted: true });
  };

  resetButton = e => {
    e.preventDefault();
    this.setState({
      name: '',
      email: '',
      phone: '',
      submitting: false,
      submitted: false,
      errorMessage: '',
    });
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
          <section className="container-lg">
            <div
              className={`cell example example1  ${this.state.submitting && 'submitting'} ${this.state.submitted &&
                'submitted'}`}
            >
              <form>
                <fieldset>
                  <div className="row">
                    <label htmlFor="example1-name" data-tid="elements_examples.form.name_label">
                      Name
                    </label>
                    <input
                      id="example1-name"
                      data-tid="elements_examples.form.name_placeholder"
                      type="text"
                      placeholder="Daniels Sleifmanis"
                      required=""
                      autoComplete="name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="row">
                    <label htmlFor="example1-email" data-tid="elements_examples.form.email_label">
                      Email
                    </label>
                    <input
                      id="example1-email"
                      data-tid="elements_examples.form.email_placeholder"
                      type="email"
                      placeholder="dancheskus@gmail.com"
                      required=""
                      autoComplete="email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="row">
                    <label htmlFor="example1-phone" data-tid="elements_examples.form.phone_label">
                      Phone
                    </label>
                    <input
                      id="example1-phone"
                      data-tid="elements_examples.form.phone_placeholder"
                      type="tel"
                      placeholder="+371 25506338"
                      required=""
                      autoComplete="tel"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.handleChange}
                    />
                  </div>
                </fieldset>
                <fieldset>
                  <div className="row">
                    <CardElement
                      onReady={c => (this._element = c)}
                      style={style}
                      onChange={e =>
                        e.error ? this.setState({ errorMessage: e.error.message }) : this.setState({ errorMessage: '' })
                      }
                    />
                  </div>
                </fieldset>
                <button type="submit" data-tid="elements_examples.form.pay_button" onClick={this.handleSubmit}>
                  Pay {this.state.amount / 100}€
                </button>
                <div className={`error ${this.state.errorMessage && 'visible'}`} role="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
                    <path
                      className="base"
                      fill="#000"
                      d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
                    />
                    <path
                      className="glyph"
                      fill="#FFF"
                      d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
                    />
                  </svg>
                  <span className="message">{this.state.errorMessage}</span>
                </div>
              </form>
              <div className="success">
                <div className="icon">
                  <svg
                    width="84px"
                    height="84px"
                    viewBox="0 0 84 84"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <circle
                      className="border"
                      cx="42"
                      cy="42"
                      r="40"
                      strokeLinecap="round"
                      strokeWidth="4"
                      stroke="#000"
                      fill="none"
                    />
                    <path
                      className="checkmark"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M23.375 42.5488281 36.8840688 56.0578969 64.891932 28.0500338"
                      strokeWidth="4"
                      stroke="#000"
                      fill="none"
                    />
                  </svg>
                </div>
                <h3 className="title" data-tid="elements_examples.success.title">
                  Payment successful
                </h3>
                <p className="message">
                  <span data-tid="elements_examples.success.message">Thank you for your payment</span>
                </p>
                <a className="reset" onClick={this.resetButton}>
                  <svg
                    width="32px"
                    height="32px"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <path
                      fill="#000000"
                      d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
