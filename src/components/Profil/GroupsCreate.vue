<template>
  <b-container fluid class="my-5">
    <h1>{{ $t('group.create') }}:</h1>
    <b-row class="justify-content-center">
      <b-col cols="auto">
        <label class="mt-2">{{ $t('group.name') }}*:</label>
        <b-form-input v-model="group.name"/>
        <label class="mt-2">{{ $t('group.image') }}:</label>
        <div>
          <b-form-file
            v-model="group.image"
            accept="image/*"
            @input="onFilePicked"
          />
          <img
            class="py-2"
            :src="fileInfo.url"
            style="max-width: 300px; max-height: 150px;"
          >
        </div>
        <label class="mt-2">{{ $t('group.isPublic') }}</label>
        <b-form-checkbox v-model="group.visibility" name="display_name" switch />
        <b-button class="m-2 p-1" size="sm" variant="primary" @click="submit">
          {{ $t('group.create') }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable no-param-reassign */
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';

export default {
  name: 'GroupsCreate',
  props: {},
  data() {
    return {
      group: {
        name: '',
        visibility: false,
        image: null,
      },
      fileInfo: {},
    };
  },
  apollo: {
    groups: {
      query() {
        const query = `
          query groups($userId: Int!) {
            groups(userId: $userId) {
              id,
              name,
            }
          }
        `;
        return gql(query);
      },
      variables() {
        return {
          userId: this.userId,
        };
      },
      skip() {
        return this.userId === null;
      },
    },
  },
  computed: {
    ...mapGetters({ userId: 'auth/userId' }),
  },
  methods: {
    onFilePicked(file) {
      if (file !== undefined) {
        const { name } = file;
        if (name.lastIndexOf('.') <= 0) {
          return;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener('load', () => {
          const objectFile = file;
          const url = fileReader.result;
          this.fileInfo = { name, file: objectFile, url };
        });
      }
    },
    async submit() {
      const mutation = `mutation addGroup($item: GroupAdd!) {
        addGroup(item: $item) {
          id,
          name,
        }
      }`;
      try {
        const response = await this.$apollo.mutate({
          mutation: gql(mutation),
          variables: {
            item: {
              name: this.group.name,
              admin_id: this.userId,
              visibility: this.group.visibility,
              image: this.fileInfo,
            },
          },
          refetchQueries: ['groups'],
        });
        this.$router.push({ name: 'group-details', params: { id: response.data.addGroup.id } });
      } catch (error) {
        console.error(error);
        this.showToast({ message: error.message, variant: 'danger' });
      }
    },
  },
};
</script>
