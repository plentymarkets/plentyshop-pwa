import type { NewsletterSubscribeContent } from './types';

const getNewsletterDescription = (title: string, htmlDescription: string) => {
  const hasHeading = /<h[1-6]\b/i.test(htmlDescription);

  if (hasHeading) {
    return htmlDescription;
  }

  return `<h2 style="text-align: center;"><strong>${title}</strong></h2>${htmlDescription}`;
};

export function initializeNewsletterContent(content: Partial<NewsletterSubscribeContent>): NewsletterSubscribeContent {
  const title = content.text?.title || 'Newsletter';
  const htmlDescription = content.text?.htmlDescription ?? '';

  if (!content.text) {
    content.text = {
      bgColor: '',
      title: '',
      htmlDescription: getNewsletterDescription(title, htmlDescription),
    };
  } else {
    if (content.text.bgColor === undefined) content.text.bgColor = '';
    if (content.text.title === undefined) content.text.title = '';

    content.text.htmlDescription = getNewsletterDescription(title, htmlDescription);
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
    content.settings = { emailFolderId: 1 };
  } else {
    if (content.settings.emailFolderId === undefined) content.settings.emailFolderId = 1;
  }

  return content as NewsletterSubscribeContent;
}
