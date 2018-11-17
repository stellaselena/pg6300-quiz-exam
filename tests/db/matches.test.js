import expect from "expect";
const Matches = require('../../server/db/matches');


describe('Test create & update a match', () => {
  it('Create & update a match', () => {
    const matchId = Matches.createMatch("foo", 30);
    Matches.updateMatch(matchId, "foo", 40);

    const matches = Matches.getMatches();
    expect(matches.length).toBe(1);
  });

});
