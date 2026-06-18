import type { BlocksListContribution } from '~/composables/useBlocksList/types';

export default {
  "header": {
    "category": "header",
    "accessControl": [
      "content"
    ],
    "title": "Header",
    "blockName": "Header",
    "variations": [
      {
        "title": "Utility Bar Default",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/utility-bar-thumbnail.svg",
        "template": {
          "en": {
            "name": "UtilityBar",
            "type": "content",
            "meta": {
              "uuid": "12345678-1234-5678-1234-567812345678"
            },
            "content": {
              "layout": {
                "paddingTop": 20,
                "paddingBottom": 20,
                "paddingLeft": 40,
                "paddingRight": 40
              },
              "sectionOrder": {
                "sections": [
                  "logo",
                  "search",
                  "actions"
                ]
              },
              "sectionVisibility": {
                "logo": true,
                "search": true,
                "actions": true
              },
              "color": {
                "iconColor": "#ffffff",
                "backgroundColor": "rgb(var(--colors-2-primary-500))"
              },
              "search": {
                "displayMode": "full"
              },
              "actions": {
                "order": [
                  "language",
                  "wishlist",
                  "cart",
                  "account"
                ],
                "visibility": {
                  "language": true,
                  "wishlist": true,
                  "cart": true,
                  "account": true
                }
              }
            }
          },
          "de": {
            "name": "UtilityBar",
            "type": "content",
            "meta": {
              "uuid": "12345678-1234-5678-1234-567812345678"
            },
            "content": {
              "layout": {
                "paddingTop": 20,
                "paddingBottom": 20,
                "paddingLeft": 40,
                "paddingRight": 40
              },
              "sectionOrder": {
                "sections": [
                  "logo",
                  "search",
                  "actions"
                ]
              },
              "sectionVisibility": {
                "logo": true,
                "search": true,
                "actions": true
              },
              "color": {
                "iconColor": "#ffffff",
                "backgroundColor": "rgb(var(--colors-2-primary-500))"
              },
              "search": {
                "displayMode": "full"
              },
              "actions": {
                "order": [
                  "language",
                  "wishlist",
                  "cart",
                  "account"
                ],
                "visibility": {
                  "language": true,
                  "wishlist": true,
                  "cart": true,
                  "account": true
                }
              }
            }
          }
        }
      },
      {
        "title": "Navigation",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/navigation-thumbnail.svg",
        "template": {
          "en": {
            "name": "Navigation",
            "type": "content",
            "meta": {
              "uuid": "87654321-4321-4789-8234-123456789abc"
            },
            "content": {
              "layout": {
                "paddingTop": 20,
                "paddingBottom": 20,
                "paddingLeft": 20,
                "paddingRight": 20
              },
              "text": {
                "textAlignment": "left"
              },
              "color": {
                "backgroundColor": "#ffffff",
                "textColor": "#161A16",
                "hoverBackgroundColor": "#f5f5f5"
              }
            }
          },
          "de": {
            "name": "Navigation",
            "type": "content",
            "meta": {
              "uuid": "87654321-4321-4789-8234-123456789abc"
            },
            "content": {
              "layout": {
                "paddingTop": 20,
                "paddingBottom": 20,
                "paddingLeft": 20,
                "paddingRight": 20
              },
              "text": {
                "textAlignment": "left"
              },
              "color": {
                "backgroundColor": "#ffffff",
                "textColor": "#161A16",
                "hoverBackgroundColor": "#f5f5f5"
              }
            }
          }
        }
      },
      {
        "title": "Announcement Bar",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/announcement-bar.svg",
        "template": {
          "en": {
            "name": "Carousel",
            "type": "structure",
            "meta": {
              "uuid": "47e5b671-f9b5-47ee-9271-066575d8e4e7"
            },
            "configuration": {
              "controls": {
                "color": "#000000",
                "displayIndicators": false
              },
              "layout": {
                "fullWidth": true
              },
              "visible": true
            },
            "content": [
              {
                "name": "AnnouncementBar",
                "type": "content",
                "meta": {
                  "uuid": "cf7a2410-3173-1434-9bc8-4588e904fcbe"
                },
                "configuration": {
                  "visible": true
                },
                "content": {
                  "backgroundColor": "#EDFF6C",
                  "text": "This is an example announcement."
                }
              },
              {
                "name": "AnnouncementBar",
                "type": "content",
                "meta": {
                  "uuid": "cf7a2410-3177-4444-9bc5-4588e904fcbe"
                },
                "configuration": {
                  "visible": true
                },
                "content": {
                  "backgroundColor": "#EDFF6C",
                  "text": "This is another example announcement."
                }
              }
            ]
          },
          "de": {
            "name": "Carousel",
            "type": "structure",
            "meta": {
              "uuid": "5ff701a4-4b18-4364-b494-4f2cf223e8c4"
            },
            "configuration": {
              "controls": {
                "color": "#000000",
                "displayIndicators": false
              },
              "layout": {
                "fullWidth": true
              },
              "visible": true
            },
            "content": [
              {
                "name": "AnnouncementBar",
                "type": "content",
                "meta": {
                  "uuid": "76a7fc16-ada0-4e73-a1e0-ead3774387e0"
                },
                "configuration": {
                  "visible": true
                },
                "content": {
                  "backgroundColor": "#EDFF6C",
                  "text": "Dies ist eine Beispielankündigung."
                }
              },
              {
                "name": "AnnouncementBar",
                "type": "content",
                "meta": {
                  "uuid": "7e9dcf94-8bb4-41ed-a056-03a64b99b866"
                },
                "configuration": {
                  "visible": true
                },
                "content": {
                  "backgroundColor": "#EDFF6C",
                  "text": "Dies ist eine weitere Beispielankündigung."
                }
              }
            ]
          }
        }
      }
    ]
  },
} satisfies BlocksListContribution;
