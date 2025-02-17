export type ModelContentTransferSetupFields = {
  [key: string]:
    | Record<string, ModelContentTransferSetupFields>
    | Record<string, (ModelContentTransferSetupFields & ModelContentTransferSetupDZFields)[]>
    | boolean;
};

export type ModelContentTransferSetupDZFields = {
  __component__: string;
} & ModelContentTransferSetupFields;

export type ModelContentTransferSetup = {
  __model__: boolean;
} & (ModelContentTransferSetupFields | ModelContentTransferSetupDZFields[]);

export type ContentTransferSetup = {
  has_setup: boolean;
  setup: ModelContentTransferSetup[];
};
