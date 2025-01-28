/* eslint-disable max-lines */
// Category will be used to sort at the next step
// We can also add description if we need to add toltips or stuff like that

// We could also send configuration here --- that will be the JSON
export const blocksLists = {
  'image-banner': {
    category: 'image-banner',
    title: 'Image Banner',
    variations: [
      {
        title: 'Image Banner Left',
        image: '/images/blocks/image_banner_left.png',
        template: {
          en: {
            name: 'UiCarousel',
            options: {
              bannerItems: [
                {
                  controls: {
                    color: '#fff',
                  },

                  image: {
                    desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Feel the music',
                    title: 'Your Sound, Elevated',
                    htmlDescription:
                      "Immserse yourself in rich, crystal-clear audio with our cutting-edge headphones. Designed for the ultimate listening experience, whether you're a casual listener or an audiophile. Discover the perfect blend of style, comfort, and sound quality that elevates your music to new heights.",
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'start',
                  },
                  button: {
                    label: 'Discover Capybara',
                    link: '/gear/headphones-capybara_157',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    desktop:
                      'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'The Future of Aerial Photography',
                    title: 'Drone Omega',
                    htmlDescription:
                      "A lightweight drone designed for stunning aerial footage. With a high-resolution camera on a 3-axis gimbal and up to 45 minutes of flight time, it's perfect for capturing smooth, stable video. Featuring GPS-assisted hover, obstacle avoidance, and easy portability, the Drone brings innovation and simplicity to your aerial shots.",
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'start',
                  },
                  button: {
                    label: 'Discover Omega',
                    link: '/gear/drone-omega_154',
                    variant: 'primary',
                  },
                },
              ],
            },
          },

          de: {
            name: 'UiCarousel',
            options: {
              bannerItems: [
                {
                  controls: {
                    color: '#fff',
                  },
                  image: {
                    desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Kristalklare Klänge Genießen',
                    title: 'Ihr Sound',
                    subtitle: 'Auf höchstem Niveau',
                    htmlDescription:
                      'Unsere hochmodernen Kopfhörer: Entwickelt für das ultimative Hörerlebnis genügen sie auch den höchsten Ansprüchen. Entdecken Sie die perfekte Mischung aus Stil, Komfort und Klangqualität, die Ihren Musikgenuss auf ein völlig neues Niveau hebt.',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'start',
                  },
                  button: {
                    label: 'Capybara entdecken',
                    link: '/gear/headphones-capybara_157',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    desktop:
                      'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Die Zukunft der Luftbildfotografie',
                    title: 'Drone Omega',
                    htmlDescription:
                      'Omega ist eine leichte Drohne, die für atemberaubende Luftaufnahmen entwickelt wurde. Mit einer hochauflösenden Kamera auf einem 3-Achsen-Gimbal und einer Flugzeit von bis zu 45 Minuten sorgt sie für stabile, flüssige Videos. GPS-unterstützter Schwebeflug, Hindernisvermeidung und einfache Transportfähigkeit machen die Drone zum perfekten Begleiter für Ihre Aufnahmen.',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'start',
                  },
                  button: {
                    label: 'Omega entdecken',
                    link: '/gear/drone-omega_154',
                    variant: 'primary',
                  },
                },
              ],
            },
          },
        },
      },
      {
        title: 'Image Banner Right',
        image: '/images/blocks/image_banner_right.png',
        template: {
          en: {
            name: 'UiCarousel',
            options: {
              bannerItems: [
                {
                  controls: {
                    color: '#fff',
                  },

                  image: {
                    desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Feel the music',
                    title: 'Your Sound, Elevated',
                    htmlDescription:
                      "Immserse yourself in rich, crystal-clear audio with our cutting-edge headphones. Designed for the ultimate listening experience, whether you're a casual listener or an audiophile. Discover the perfect blend of style, comfort, and sound quality that elevates your music to new heights.",
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'end',
                  },
                  button: {
                    label: 'Discover Capybara',
                    link: '/gear/headphones-capybara_157',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    desktop:
                      'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'The Future of Aerial Photography',
                    title: 'Drone Omega',
                    htmlDescription:
                      "A lightweight drone designed for stunning aerial footage. With a high-resolution camera on a 3-axis gimbal and up to 45 minutes of flight time, it's perfect for capturing smooth, stable video. Featuring GPS-assisted hover, obstacle avoidance, and easy portability, the Drone brings innovation and simplicity to your aerial shots.",
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'end',
                  },
                  button: {
                    label: 'Discover Omega',
                    link: '/gear/drone-omega_154',
                    variant: 'primary',
                  },
                },
              ],
            },
          },

          de: {
            name: 'UiCarousel',
            options: {
              bannerItems: [
                {
                  controls: {
                    color: '#fff',
                  },
                  image: {
                    desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Kristalklare Klänge Genießen',
                    title: 'Ihr Sound',
                    subtitle: 'Auf höchstem Niveau',
                    htmlDescription:
                      'Unsere hochmodernen Kopfhörer: Entwickelt für das ultimative Hörerlebnis genügen sie auch den höchsten Ansprüchen. Entdecken Sie die perfekte Mischung aus Stil, Komfort und Klangqualität, die Ihren Musikgenuss auf ein völlig neues Niveau hebt.',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'start',
                  },
                  button: {
                    label: 'Capybara entdecken',
                    link: '/gear/headphones-capybara_157',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    desktop:
                      'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Die Zukunft der Luftbildfotografie',
                    title: 'Drone Omega',
                    htmlDescription:
                      'Omega ist eine leichte Drohne, die für atemberaubende Luftaufnahmen entwickelt wurde. Mit einer hochauflösenden Kamera auf einem 3-Achsen-Gimbal und einer Flugzeit von bis zu 45 Minuten sorgt sie für stabile, flüssige Videos. GPS-unterstützter Schwebeflug, Hindernisvermeidung und einfache Transportfähigkeit machen die Drone zum perfekten Begleiter für Ihre Aufnahmen.',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'start',
                  },
                  button: {
                    label: 'Omega entdecken',
                    link: '/gear/drone-omega_154',
                    variant: 'primary',
                  },
                },
              ],
            },
          },
        },
      },
      {
        title: 'Image Banner Center',
        image: '/images/blocks/image_banner_center.png',
        template: {
          en: {
            name: 'UiCarousel',
            options: {
              bannerItems: [
                {
                  controls: {
                    color: '#fff',
                  },

                  image: {
                    desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Feel the music',
                    title: 'Your Sound, Elevated',
                    htmlDescription:
                      "Immserse yourself in rich, crystal-clear audio with our cutting-edge headphones. Designed for the ultimate listening experience, whether you're a casual listener or an audiophile. Discover the perfect blend of style, comfort, and sound quality that elevates your music to new heights.",
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Discover Capybara',
                    link: '/gear/headphones-capybara_157',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    desktop:
                      'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'The Future of Aerial Photography',
                    title: 'Drone Omega',
                    htmlDescription:
                      "A lightweight drone designed for stunning aerial footage. With a high-resolution camera on a 3-axis gimbal and up to 45 minutes of flight time, it's perfect for capturing smooth, stable video. Featuring GPS-assisted hover, obstacle avoidance, and easy portability, the Drone brings innovation and simplicity to your aerial shots.",
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Discover Omega',
                    link: '/gear/drone-omega_154',
                    variant: 'primary',
                  },
                },
              ],
            },
          },

          de: {
            name: 'UiCarousel',
            options: {
              bannerItems: [
                {
                  controls: {
                    color: '#fff',
                  },
                  image: {
                    desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Kristalklare Klänge Genießen',
                    title: 'Ihr Sound',
                    subtitle: 'Auf höchstem Niveau',
                    htmlDescription:
                      'Unsere hochmodernen Kopfhörer: Entwickelt für das ultimative Hörerlebnis genügen sie auch den höchsten Ansprüchen. Entdecken Sie die perfekte Mischung aus Stil, Komfort und Klangqualität, die Ihren Musikgenuss auf ein völlig neues Niveau hebt.',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Capybara entdecken',
                    link: '/gear/headphones-capybara_157',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    desktop:
                      'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
                    tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
                    mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Die Zukunft der Luftbildfotografie',
                    title: 'Drone Omega',
                    htmlDescription:
                      'Omega ist eine leichte Drohne, die für atemberaubende Luftaufnahmen entwickelt wurde. Mit einer hochauflösenden Kamera auf einem 3-Achsen-Gimbal und einer Flugzeit von bis zu 45 Minuten sorgt sie für stabile, flüssige Videos. GPS-unterstützter Schwebeflug, Hindernisvermeidung und einfache Transportfähigkeit machen die Drone zum perfekten Begleiter für Ihre Aufnahmen.',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Omega entdecken',
                    link: '/gear/drone-omega_154',
                    variant: 'primary',
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  'image-with-text': {
    category: 'image-with-text',
    title: 'Image with Text',
    variations: [
      {
        title: 'Image Right Text',
        image: '/images/blocks/image_right_text.png',
        template: {
          en: {
            name: 'UiImageText',
            options: {
              text: {
                htmlDescription:
                  "<p>Our headphone collection sets new standards in audio precision. With deep bass, crystal-clear highs, and an impressive soundstage, these headphones deliver a unique listening experience for every music genre. Combining modern design, maximum comfort, and cutting-edge technology, they are the perfect choice for anyone who refuses to compromise on sound quality.</p><ul class='list-disc pl-4 mt-4 space-y-1'><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul>",
                title: 'A New Listening Experience',
                subtitle: 'Innovative technology meets modern fashion',
                textAlignment: 'right',
              },
              button: {
                label: 'To our headphones',
                link: '/gear/headphones-capybara_157',
                variant: 'primary',
              },
              image: {
                desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                alt: 'Headphones',
                imageAlignment: 'left',
              },
            },
          },

          de: {
            name: 'UiImageText',
            options: {
              text: {
                htmlDescription:
                  "<p>Our headphone collection sets new standards in audio precision. With deep bass, crystal-clear highs, and an impressive soundstage, these headphones deliver a unique listening experience for every music genre. Combining modern design, maximum comfort, and cutting-edge technology, they are the perfect choice for anyone who refuses to compromise on sound quality.</p><ul class='list-disc pl-4 mt-4 space-y-1'><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul>",
                title: 'A New Listening Experience',
                subtitle: 'Innovative technology meets modern fashion',
                textAlignment: 'right',
              },
              button: {
                label: 'To our headphones',
                link: '/gear/headphones-capybara_157',
                variant: 'primary',
              },
              image: {
                desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                alt: 'Headphones',
                imageAlignment: 'left',
              },
            },
          },
        },
      },
      {
        title: 'Image Left Text',
        image: '/images/blocks/image_left_text.png',
        template: {
          en: {
            name: 'UiImageText',
            options: {
              text: {
                htmlDescription:
                  "<p>Our headphone collection sets new standards in audio precision. With deep bass, crystal-clear highs, and an impressive soundstage, these headphones deliver a unique listening experience for every music genre. Combining modern design, maximum comfort, and cutting-edge technology, they are the perfect choice for anyone who refuses to compromise on sound quality.</p><ul class='list-disc pl-4 mt-4 space-y-1'><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul>",
                title: 'A New Listening Experience',
                subtitle: 'Innovative technology meets modern fashion',
                textAlignment: 'left',
              },
              button: {
                label: 'To our headphones',
                link: '/gear/headphones-capybara_157',
                variant: 'primary',
              },
              image: {
                desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                alt: 'Headphones',
                imageAlignment: 'left',
              },
            },
          },

          de: {
            name: 'UiImageText',
            options: {
              text: {
                htmlDescription:
                  "<p>Our headphone collection sets new standards in audio precision. With deep bass, crystal-clear highs, and an impressive soundstage, these headphones deliver a unique listening experience for every music genre. Combining modern design, maximum comfort, and cutting-edge technology, they are the perfect choice for anyone who refuses to compromise on sound quality.</p><ul class='list-disc pl-4 mt-4 space-y-1'><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul>",
                title: 'A New Listening Experience',
                subtitle: 'Innovative technology meets modern fashion',
                textAlignment: 'left',
              },
              button: {
                label: 'To our headphones',
                link: '/gear/headphones-capybara_157',
                variant: 'primary',
              },
              image: {
                desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
                alt: 'Headphones',
                imageAlignment: 'left',
              },
            },
          },
        },
      },
    ],
  },
  'rich-text': {
    category: 'rich-text',
    title: 'Rich Text',
    variations: [
      {
        title: 'Rich Text',
        image: '/images/blocks/rich_text.png',
        template: {
          en: {
            name: 'UiTextCard',
            options: {
              text: {
                htmlDescription:
                  '<p>Willkommen in unserem Shop, wo Technikbegeisterte und Fashion-Liebhaber gleichermaßen fündig werden! Von hochwertigen Kopfhörern und leistungsstarken Drohnen bis hin zu stilvoller Kleidung finden Sie bei uns alles, was Ihren Alltag smarter und Ihren Look einzigartig macht.</p><p>Unser Ziel ist es, Ihnen eine erstklassige Auswahl an Produkten zu bieten, die Qualität, Innovation und Design vereinen. Ob Sie nach einem neuen Lautsprecher für den perfekten Sound suchen oder nach einem lässigen Hoodie, der Ihrem Stil entspricht – wir haben, was Sie brauchen.</p>',
                pretitle: 'Willkommen in Ihrem neuen Lieblingsshop',
                title: 'Entdecke Technik & Style',
                subtitle: 'Innovative Technik trifft auf moderne Mode',
                textAlignment: 'center',
              },
              button: {
                buttonText: 'Jetzt zuschlagen',
                link: '',
                variant: 'primary',
              },
            },
          },
          de: {
            name: 'UiTextCard',
            options: {
              text: {
                htmlDescription:
                  '<p>Willkommen in unserem Shop, wo Technikbegeisterte und Fashion-Liebhaber gleichermaßen fündig werden! Von hochwertigen Kopfhörern und leistungsstarken Drohnen bis hin zu stilvoller Kleidung finden Sie bei uns alles, was Ihren Alltag smarter und Ihren Look einzigartig macht.</p><p>Unser Ziel ist es, Ihnen eine erstklassige Auswahl an Produkten zu bieten, die Qualität, Innovation und Design vereinen. Ob Sie nach einem neuen Lautsprecher für den perfekten Sound suchen oder nach einem lässigen Hoodie, der Ihrem Stil entspricht – wir haben, was Sie brauchen.</p>',
                pretitle: 'Willkommen in Ihrem neuen Lieblingsshop',
                title: 'Entdecke Technik & Style',
                subtitle: 'Innovative Technik trifft auf moderne Mode',
                textAlignment: 'center',
              },
              button: {
                buttonText: 'Jetzt zuschlagen',
                link: '',
                variant: 'primary',
              },
            },
          },
        },
      },
    ],
  },
  'product-galleries': {
    category: 'product-galleries',
    title: 'Products',
    variations: [
      {
        title: 'Product Galleries',
        image: '/images/blocks/product_galleries.png',
        template: {
          en: {
            name: 'ProductRecommendedProducts',
            options: {
              text: {
                pretitle: 'Mehr als nur Technik',
                title: 'Entdecken Sie unsere Modekollektion',
                subtitle: 'Sportive Mode und Accessories für alle.',
                htmlDescription:
                  "<a class='underline' href='https://plentyshop.plentymarkets.com/wear' target='_self'>Zu unserer kompletten Kollektion.</a>",
              },
              categoryId: '49',
            },
          },
          de: {
            name: 'ProductRecommendedProducts',
            options: {
              text: {
                pretitle: 'Mehr als nur Technik',
                title: 'Entdecken Sie unsere Modekollektion',
                subtitle: 'Sportive Mode und Accessories für alle.',
                htmlDescription:
                  "<a class='underline' href='https://plentyshop.plentymarkets.com/wear' target='_self'>Zu unserer kompletten Kollektion.</a>",
              },
              categoryId: '49',
            },
          },
        },
      },
    ],
  },
  'forms': {
    category: 'forms',
    title: 'Forms',
    variations: [
      {
        title: 'Forms Preview',
        image: '/images/blocks/forms_preview.png',
        template: {
          en: {
            name: 'NewsletterSubscribe',
            options: {
              text: {
                bgColor: '#f5f5f5',
                title: 'Subscribe to our Newsletter',
                htmlDescription: 'Be aware of upcoming sales and events. Receive gifts and special offers!',
              },
              input: {
                displayNameInput: false,
                nameIsRequired: false,
              },
              button: {
                label: 'Subscribe To Newsletter',
              },
            },
          },

          de: {
            name: 'NewsletterSubscribe',
            options: {
              text: {
                bgColor: '#f5f5f5',
                title: 'Subscribe to our Newsletter',
                htmlDescription: 'Be aware of upcoming sales and events. Receive gifts and special offers!',
              },
              input: {
                displayNameInput: false,
                nameIsRequired: false,
              },
              button: {
                label: 'Subscribe To Newsletter',
              },
            },
          },
        },
      },
    ],
  },
};
