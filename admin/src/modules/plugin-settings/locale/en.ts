export default {
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  off: 'Off',
  on: 'On',
  clear: 'Clear',

  /* Global Settings */
  global_settings: 'Global Settings',
  global_settings_description: 'Setup the Localazy plugin upload/download options.',

  upload_settings: 'Upload settings',
  allow_automated_upload_to_localazy: 'Allow automated upload to Localazy',
  allow_automated_upload_to_localazy_info:
    'Content will be automatically uploaded to Localazy after its creation or update.',
  automated_upload_triggers: 'Automated upload triggers',
  automated_upload_triggers_placeholder: 'Select triggers',
  creating_new_data_entry: 'Creating new data entry',
  editing_data_entry: 'Editing data entry',
  automated_upload_triggers_info: 'Select actions that will trigger an upload of Strapi data to Localazy.',

  deprecate_source_keys_on_delete: 'Deprecate source keys on deletion',
  deprecate_source_keys_on_delete_info:
    'Source keys will be automatically set as deprecated if an entry in source language is deleted in Strapi',

  download_settings: 'Download settings',
  processing_of_download_webhook: 'Processing of download webhook',
  processing_of_download_webhook_info:
    'You can temporarily disable the webhook processing and the information will be scrapped.',
  webhook_author: 'Webhook actions author',
  webhook_author_info:
    'Select the author signed under the webhook actions (required by Strapi for certain actions, e.g. creating a locale).',
  webhook_author_placeholder: 'Select webhook actions author',
  webhook_languages: 'Allowed webhook languages',
  webhook_languages_info:
    'Select the languages from Localazy. Translations of selected languages would be downloaded. If no language is selected, all translations will be downloaded.',
  webhook_languages_placeholder: 'Download all languages',

  webhook_incremental_sync: 'Use incremental sync for webhooks',
  webhook_incremental_sync_info:
    'When enabled, webhook-triggered downloads will only fetch recently changed translations. Disable to always perform a full sync via webhook.',

  global_settings_saved_successfully: 'Global Settings were saved',

  /* Content Transfer Setup */
  content_transfer_setup: 'Content Transfer Setup',
  content_transfer_setup_description: 'Select which content type fields will be uploaded to Localazy',

  content_transfer_setup_saved: 'Content Transfer Setup saved',
  content_transfer_setup_saved_successfully: 'Content Transfer Setup saved successfully',
  content_types_model_changed: 'Content Types Model Changed',
  please_update_your_content: 'Please update your content transfer setup before proceeding to upload/download',
  you_can_upload_download: 'You can upload/download ',
  only_text_based_content: 'only text based content.',
  learn_more_in_docs_message_a: 'If you want to learn more about how to setup your Content Transfer settings read the ',
  learn_more_in_docs_message_b: 'Localazy documentation.',
  there_is_nothing_to_transfer: 'There is nothing to transfer.',
  please_check_that_you_have_entered_a_valid_collection:
    'To finish the content transfer setup, you must enable localization for at least one Content-Type.',
  step_1: 'Go to the <1>Content-Type Builder</1>',
  step_2: 'Click on <1>Edit</1> and select the <1>Advanced Settings</1> tab',
  step_3: 'Check <1>Enable localization for this Content-Type</1>',
  step_4: 'Repeat for all Content-Types you want to translate',
  step_5: 'Return to this screen and finish the transfer setup',
  tree_item_count_zero: '(no selected fields)',
  tree_item_count_one: '({{count}} selected field)',
  tree_item_count_other: '({{count}} selected fields)',

  general: 'General',

  exclude_from_translation: 'Exclude this entry from translation',

  bulk_action_exclude_from_translation: 'Exclude from translation',
  bulk_action_updating_entries: 'Updating entries...',
  bulk_action_failed_message: 'Failed to update entries.',
  bulk_action_success_message: 'Entries successfully updated.',
  bulk_action_include_to_translation: 'Include to translation',
  status_excluded: 'Excluded',
  status_included: 'Included',

  webhook_setup_title: 'Webhook Configuration',
  webhook_behavior_title: 'Webhook Behavior',
  webhook_setup_description:
    'To enable automatic downloads when translations are published in Localazy, a webhook needs to be configured in your Localazy project.',
  webhook_setup_not_configured: 'Webhook is not configured',
  webhook_setup_button: 'Set up webhook',
  webhook_setup_reconfigure: 'Reconfigure webhook',
  webhook_setup_success:
    'Webhook configured successfully! Translations will be automatically downloaded when published in Localazy.',
  webhook_setup_already_configured: 'Webhook is active and configured.',
  webhook_setup_docs_link: 'Learn more about Localazy webhooks',
  webhook_setup_loading: 'Checking webhook status...',
  webhook_setup_error: 'Failed to set up webhook. Please try again or configure it manually in Localazy.',

  webhook_setup_modal_title: 'Set up Localazy webhook',
  webhook_setup_step1_title: '1. Verify your Strapi URL',
  webhook_setup_step1_description:
    'This is the URL that Localazy will call when translations are published. It must be publicly accessible from the internet.',
  webhook_setup_step2_title: '2. Confirm the webhook endpoint',
  webhook_setup_url_hint:
    'The URL is prefilled from your Strapi server configuration. Edit it if your public URL is different.',
  webhook_setup_ngrok_hint:
    '💡 For local development, use a tunneling tool like ngrok (e.g. ngrok http 1337) to expose your local Strapi instance to the internet.',
  webhook_setup_step3_title: '3. Click confirm to register',
  webhook_setup_step3_description:
    'This will register a webhook in your Localazy project that triggers on "Project Published" events. You can manage webhooks anytime in your Localazy project settings.',
  webhook_setup_confirm: 'Confirm & set up webhook',
  webhook_setup_local_warning:
    'The detected URL points to a local/private address. Localazy will not be able to reach this URL. Use a tunneling tool or replace with your public URL.',
};
