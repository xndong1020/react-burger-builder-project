import React, { Component } from 'react';

import Modal from '../UI/Modal/Modal';
import Aux from '../../hoc/Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = { error: null };

    // componentWillMount() {
    //   console.log("chk props", this.props)
    //   this.reqInterceptor = axios.interceptors.request.use(req => {
    //     this.setState({ error: null });
    //     return req;
    //   });
    //   this.resInterceptor = axios.interceptors.response.use(
    //     res => res,
    //     error => {
    //       this.setState({ error: error });
    //     }
    //   );
    // }

    componentWillUnmount() {
      console.log('Will Unmount', this.reqInterceptor, this.resInterceptor);
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.reqInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      return (
        <Aux>
          <Modal
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}
          >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          {/* The props are from the parent component of BurgerBuilder in this case. We don't know what they are but we don't want to lose them. If we don't pass them in then any props from the parent component of BB will be swallowed here and will be not passed to BB. */}
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
