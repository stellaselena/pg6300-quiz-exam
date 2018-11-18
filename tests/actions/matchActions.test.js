import expect from 'expect';
import * as matchActions from '../../src/actions/matchActions';
import * as types from '../../src/actions/actionTypes';
import 'babel-polyfill';

describe('Match Actions', () => {
  describe('createMatchSuccess', () => {
    it('should create a CREATE_MATCH_SUCCESS action', () => {
      const match = {userId: 'foo', score: 30};
      const expectedAction = {
        type: types.CREATE_MATCH_SUCCESS,
        match: match
      };

      const action = matchActions.createMatchSuccess(match);

      expect(action).toEqual(expectedAction);
    });
  });
  describe('loadMatchSuccess', () => {
    it('should create a LOAD_MATCH_SUCCESS action', () => {
      const expectedAction = {
        type: types.LOAD_MATCHES_SUCCESS
      };

      const action = matchActions.loadMatchesSuccess();
      expect(action).toEqual(expectedAction);
    });
  });
});
