import styled from 'styled-components';

import { Form, Container, Alert } from 'reactstrap';

import BGimage from '../../img/background-login.jpg';

export const StyledAlert = styled(Alert)`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
`;

export const Background = styled.div`
  background: url(${BGimage}) center no-repeat;
  background-size: cover;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const FlexCenter = styled.div`
  flex-grow: 1;
  display: flex;
`;

export const StyledForm = styled(Form)`
  .bg-white {
  }

  .form-group {
    margin: 0;

    input {
      padding: 25px;
      border: none;
      border-bottom: 1px solid #ced4da;
      box-shadow: none;
      border-radius: 0;

      &.is-valid {
        background: rgba(101, 219, 101, 0.24);
        /* border: 1px solid rgba(101, 219, 101, 0.24); */
      }

      &.is-invalid {
        background: rgba(248, 122, 122, 0.24);
        /* border: 1px solid red; */
      }
    }

    &:first-of-type input {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    &:last-of-type input {
      border-bottom: 0;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }

  && button {
    margin-top: 70px;
    padding: 12.5px;
    border: none;
    transition: transform 0.2s;
    box-shadow: none;

    &:hover {
      transform: translateY(-2px);
    }

    &.main-button {
      background: rgb(72, 172, 152);
      color: #fff;

      &:hover {
        background: rgb(72, 172, 152);
      }

      &:active {
        background-color: rgb(72, 172, 152);
        border-color: rgb(72, 172, 152);
      }
    }

    &.second-button {
      margin-top: 20px;
      background: #fff;
      color: rgb(72, 172, 152);

      &:hover {
        background: #fff;
      }
    }
  }
`;
