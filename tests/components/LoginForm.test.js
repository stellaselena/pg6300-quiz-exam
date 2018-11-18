import expect from 'expect';
import React from 'react';
import {mount, shallow} from 'enzyme';
import LoginForm from '../../src/components/login/LoginForm';
import '../../tools/testSetup';

function setup(onConfirmChange) {
  const props = {
    confirm: "",
    onConfirmChange: onConfirmChange,
    password: "",
    onPasswordChange: () => {} ,
    userId: "",
    onUserIdChange: () => {},
    error: () => {},
    onSubmit: {}
  };

  return shallow(<LoginForm {...props} />);
}

describe('LoginForm via Enzyme', () => {
  it('renders login form and login h1', () => {
    const wrapper = setup(null);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('h1').text()).toEqual('Login');
  });

  it('renders signup form and signup h1', () => {
    const wrapper = setup(() => {});
    expect(wrapper.find('h1').text()).toEqual('Sign up');
  });

});
