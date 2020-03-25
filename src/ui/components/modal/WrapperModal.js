import React, { Component } from 'react';
import PropType from 'prop-types';

import Modal from 'react-native-modal';

import {
  pushInstance,
  attachListener,
  removeInstance,
  removeInstanceOnUnmount,
} from './WrapperHelper';

class ModalWrapper extends Component {
  static propTypes = {
    isVisible: PropType.bool.isRequired,
    dismissModalFromWrapper: PropType.func,
    children: PropType.any,
    onModalHide: PropType.func,
  };

  state = { isVisible: false };

  componentDidMount() {
    const { isVisible } = this.props;
    attachListener(this.checkInstanceLength);
    if (isVisible) {
      pushInstance(this);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible) {
      if (nextProps.isVisible === true) {
        pushInstance(this);
      } else if (nextProps.isVisible === false) {
        this.setState({ isVisible: false });
      }
    }
  }

  componentWillUnmount() {
    this.removeInstanceFromHelper();
  }

  checkInstanceLength = async (length, instanceAtTop) => {
    const { dismissModalFromWrapper } = this.props;
    if (length === 1 && instanceAtTop === this) {
      this.setState({ isVisible: true });
    } else if (length > 1 && instanceAtTop === this) {
      dismissModalFromWrapper && dismissModalFromWrapper();
    }
  };

  combinedOnModalHide = () => {
    if (this.props.onModalHide) {
      this.props.onModalHide();
    }
    this.removeInstanceFromGlobal();
  };

  removeInstanceFromGlobal = () => {
    removeInstance(this);
  };

  removeInstanceFromHelper = () => {
    removeInstanceOnUnmount(this, this.checkInstanceLength);
  };

  render() {
    const { ...otherProps } = this.props;
    delete otherProps.onModalHide; //because we overwrite the prop here
    delete otherProps.isVisible; //because we overwrite the prop here
    return (
      <Modal
        isVisible={this.state.isVisible}
        onModalHide={this.combinedOnModalHide}
        {...otherProps}>
        {this.props.children}
      </Modal>
    );
  }
}

export default ModalWrapper;
