/* eslint-disable no-empty-pattern */
import gql from 'graphql-tag';

export default {
  async acceptInvitation({}, groupId) {
    try {
      const mutation = 'mutation acceptGroup($groupId: Int!) { acceptGroup(groupId: $groupId) { id } }';
      const response = await this.$apollo.defaultClient.mutate({
        mutation: gql(mutation),
        variables: {
          groupId,
        },
        refetchQueries: ['group'],
      });
      if (this.$router.currentRoute.name !== 'group-details') {
        this.$router.push({ name: 'group-details', params: { id: response.data.acceptGroup.id } });
      }
    } catch (error) {
      console.error(error);
    }
  },
  async declineInvitation({}, groupId) {
    try {
      const mutation = 'mutation declineGroup($groupId: Int!) { declineGroup(groupId: $groupId) { id } }';
      await this.$apollo.defaultClient.mutate({
        mutation: gql(mutation),
        variables: {
          groupId,
        },
        refetchQueries: ['groups'],
      });
      if (this.$router.currentRoute.name === 'group-details') {
        this.$router.push({ name: 'groups' });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
