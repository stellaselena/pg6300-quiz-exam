import React from 'react';
import expect from 'expect';
import Header from '../../src/components/common/Header';
import {MemoryRouter} from 'react-router-dom';
import {mount, shallow} from 'enzyme';
import '../../tools/testSetup';

describe('Header', () => {

  it('contains 6 NavLinks via shallow', () => {
    const numLinks = shallow(<Header loading={false} />).find('NavLink').length;
    expect(numLinks).toEqual(4);
  });


  it('contains 6 anchors via mount', () => {
    const numAnchors = mount(<MemoryRouter><Header loading={false} /></MemoryRouter>).find('a').length;
    expect(numAnchors).toEqual(4);
  });

  it('contains no links with active class by default', () => {
    const linksWithActiveClass = shallow(<Header loading={false} />).find('.active');
    expect(linksWithActiveClass.length).toEqual(0);
  });
});
