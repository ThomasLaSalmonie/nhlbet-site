/* eslint-disable no-param-reassign */
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import defaultFr from '../lang/index-fr';
import defaultEn from '../lang/index-en';

export default function useI18n(context) {
  const { vueOptions } = context;

  Vue.use(VueI18n);

  const lang = localStorage.getItem('lang') || 'en';
  const i18nConfig = {
    messages: {
      fr: defaultFr,
      en: defaultEn,
    },
  };

  const i18n = new VueI18n({
    locale: lang,
    silentTranslationWarn: true,
    ...i18nConfig,
  });

  context.i18n = i18n;
  vueOptions.i18n = i18n;
}
