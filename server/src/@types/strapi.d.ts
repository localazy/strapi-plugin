import { Strapi as OriginalStrapi } from '@strapi/types/dist/core/strapi';

declare module '@strapi/strapi' {
  namespace Core {
    interface Strapi extends OriginalStrapi {
      StrapIO: any;
    }
  }
}
