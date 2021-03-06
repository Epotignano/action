import getRethink from 'server/database/rethinkDriver';
import {GraphQLNonNull, GraphQLID, GraphQLList} from 'graphql';
import {getRequestedFields} from '../utils';
import {Invitation} from './invitationSchema';
import {requireSUOrTeamMember} from '../authorization';
import makeChangefeedHandler from '../makeChangefeedHandler';

export default {
  invitations: {
    type: new GraphQLList(Invitation),
    args: {
      teamId: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The unique team ID'
      }
    },
    async resolve(source, {teamId}, {authToken, socket, subbedChannelName}, refs) {
      const r = getRethink();
      requireSUOrTeamMember(authToken, teamId);
      const requestedFields = getRequestedFields(refs);
      const changefeedHandler = makeChangefeedHandler(socket, subbedChannelName);
      const now = Date.now();
      r.table('Invitation')
        .getAll(teamId, {index: 'teamId'})
        .filter(r.row('tokenExpiration').ge(r.epochTime(now / 1000)))
        .pluck(requestedFields)
        .changes({includeInitial: true})
        .run({cursor: true}, changefeedHandler);
    }
  }
};
