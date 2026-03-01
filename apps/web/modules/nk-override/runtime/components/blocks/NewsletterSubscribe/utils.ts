import type { NewsletterSubscribeContent } from './types';

export function initializeNewsletterContent(content: Partial<NewsletterSubscribeContent>): NewsletterSubscribeContent {
  if (!content.text) {
    content.text = { bgColor: '', title: '', htmlDescription: '' };
  } else {
    if (content.text.bgColor === undefined) content.text.bgColor = '';
    if (content.text.title === undefined) content.text.title = '';
    if (content.text.htmlDescription === undefined) content.text.htmlDescription = '';
  }

  if (!content.input) {
    content.input = { displayNameInput: false, nameIsRequired: false };
  } else {
    if (content.input.displayNameInput === undefined) content.input.displayNameInput = false;
    if (content.input.nameIsRequired === undefined) content.input.nameIsRequired = false;
  }

  if (!content.button) {
    content.button = { label: '' };
  } else {
    if (content.button.label === undefined) content.button.label = '';
  }

  if (!content.settings) {
    content.settings = { 
      emailFolderId: 1,
      nkExtraTitle: ''  // NK Add your default value here
     };
  } else {
    if (content.settings.emailFolderId === undefined) content.settings.emailFolderId = 1;
    if (content.settings.nkExtraTitle === undefined) content.settings.nkExtraTitle = '';   // NK Add your default value here
  }

  return content as NewsletterSubscribeContent;
}
