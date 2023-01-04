export default {
  save: "Save",
  cancel: "Cancel",
  close: "Close",
  off: "Off",
  on: "On",
  clear: "Clear",

  /* Global Settings */
  global_settings: "Global Settings",
  global_settings_description: "Setup the Localazy plugin upload/download options.",

  upload_settings: "Upload settings",
  allow_automated_upload_to_localazy: "Allow automated upload to Localazy",
  allow_automated_upload_to_localazy_info: "Content will be automatically uploaded to Localazy after its creation or update.",
  automated_upload_triggers: "Automated upload triggers",
  automated_upload_triggers_placeholder: "Select triggers",
  creating_new_data_entry: "Creating new data entry",
  editing_data_entry: "Editing data entry",
  automated_upload_triggers_info: "Select actions that will trigger an upload of Strapi data to Localazy.",

  deprecate_source_keys_on_delete: "Deprecate source keys on deletion",
  deprecate_source_keys_on_delete_info: "Source keys will be automatically set as deprecated if an entry in source language is deleted in Strapi",

  download_settings: "Download settings",
  processing_of_download_webhook: "Processing of download webhook",
  processing_of_download_webhook_info: "You can temporarily disable the webhook processing and the information will be scrapped.",
  webhook_author: "Webhook actions author",
  webhook_author_info: "Select the author signed under the webhook actions (required by Strapi for certain actions, e.g. creating a locale).",
  webhook_author_placeholder: "Select webhook actions author",
  webhook_languages: "Allowed webhook languages",
  webhook_languages_info: "Select the languages from Localazy. Translations of selected languages would be downloaded.",
  webhook_languages_placeholder: "Select allowed webhook languages",

  global_settings_saved_successfully: "Global Settings were saved",

  /* Content Transfer Setup */
  content_transfer_setup: "Content Transfer Setup",
  content_transfer_setup_description:
    "Select which content type fields will be uploaded to Localazy",

  content_transfer_setup_saved: "Content Transfer Setup saved",
  content_transfer_setup_saved_successfully:
    "Content Transfer Setup saved successfully",
  content_types_model_changed: "Content Types Model Changed",
  please_update_your_content:
    "Please update your content transfer setup before proceeding to upload/download",
  you_can_upload_download: "You can upload/download ",
  only_text_based_content: "only text based content.",
  learn_more_in_docs_message_a: "If you want to learn more about how to setup your Content Transfer settings read the ",
  learn_more_in_docs_message_b: "Localazy documentation.",
  there_is_nothing_to_transfer: "There is nothing to transfer.",
  please_check_that_you_have_entered_a_valid_collection: "To finish the content transfer setup, you must enable localization for at least one Content-Type.",
  step_1: "Go to the <1>Content-Type Builder</1>",
  step_2: "Click on <1>Edit</1> and select the <1>Advanced Settings</1> tab",
  step_3: "Check <1>Enable localization for this Content-Type</1>",
  step_4: "Repeat for all Content-Types you want to translate",
  step_5: "Return to this screen and finish the transfer setup",

  general: "General",
};
