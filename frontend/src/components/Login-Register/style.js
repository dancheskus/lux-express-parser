import styled from 'styled-components';

import { Form, Alert } from 'reactstrap';

import BGimage from '../../img/background-login.jpg';

export const RegisterErrorTooltipStyle = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;

  &:before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background: rgba(212, 49, 49, 0.699);
    filter: blur(1px);
    position: absolute;
    top: -4px;
    right: 5px;
    display: ${props => props.visible === false && 'none'};
    animation: pulse 2s ease 0s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const StyledAlert = styled(Alert)`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
`;

export const Background = styled.div`
  background: url(${BGimage}) center no-repeat;
  background-size: cover;
`;

export const StyledForm = styled(Form)`
  .bg-white {
    overflow: hidden;
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
  }

  && button,
  a.btn {
    margin-top: 70px;
    padding: 12.5px;
    border: none;
    transition: transform 0.2s;
    box-shadow: none;

    &:hover {
      transform: translateY(-2px);
    }

    &:active {
      transition: transform 0.1s;
      transform: translateY(-1.3px);
    }

    &.main-button {
      background: rgb(72, 172, 152);
    }

    &.second-button {
      margin-top: 20px;
      color: rgb(72, 172, 152);
    }
  }
`;
