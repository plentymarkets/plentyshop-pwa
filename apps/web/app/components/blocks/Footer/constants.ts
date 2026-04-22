import type { FooterSwitchDefinition } from './types';

export const FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[] = [
  {
    columnGroup: 'legal',
    key: 'showTermsAndConditions',
    shopTranslationKey: 'legal.termsAndConditions',
    editorTranslationKey: 'column-1-terms-and-conditions-label',
    link: paths.termsAndConditions,
  },
  {
    columnGroup: 'legal',
    key: 'showLegalDisclosure',
    shopTranslationKey: 'legal.legalDisclosure',
    editorTranslationKey: 'column-1-legal-disclosure-label',
    link: paths.legalDisclosure,
  },
  {
    columnGroup: 'legal',
    key: 'showPrivacyPolicy',
    shopTranslationKey: 'legal.privacyPolicy',
    editorTranslationKey: 'column-1-privacy-policy-label',
    link: paths.privacyPolicy,
  },
  {
    columnGroup: 'legal',
    key: 'showDeclarationOfAccessibility',
    shopTranslationKey: 'legal.declarationOfAccessibility',
    editorTranslationKey: 'column-1-declaration-of-accessibility-label',
    link: paths.declarationOfAccessibility,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationRights',
    shopTranslationKey: 'legal.cancellationRights',
    editorTranslationKey: 'column-1-cancellation-rights-label',
    link: paths.cancellationRights,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationForm',
    shopTranslationKey: 'legal.cancellationForm',
    editorTranslationKey: 'column-1-cancellation-form-label',
    link: paths.cancellationForm,
  },
  {
    columnGroup: 'services',
    key: 'showContactLink',
    shopTranslationKey: 'footer.contact.label',
    editorTranslationKey: 'column-2-contact-label',
    link: paths.contact,
  },
  {
    columnGroup: 'services',
    key: 'showRegisterLink',
    shopTranslationKey: 'footer.register.label',
    editorTranslationKey: 'column-2-register-label',
    link: paths.register,
  },
];
