import { get } from 'lodash';

export default {
  methods: {
    getPathUrl(path = '') {
      const origin = process.server
        ? `http${process.env.FORCE_SSL ? 's' : ''}://${get(this.$ssrContext, 'req.headers.host', '')}`
        : get(window, 'location.origin', '');
      return `${origin}${path}`;
    },
  },
};
