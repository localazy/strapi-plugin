import type { Context } from '@strapi/types/dist/modules/documents/middleware';

export type HookParams = {
  context: Context;
  documentId: string;
  locale: string;
};
