import type { HomepageContent } from './interface';

const content: HomepageContent = {
  carousel: {
    banner1: {
      pretitle: 'Feel the music',
      title: 'Your Sound, Elevated',
      subtitle: undefined,
      description:
        "Immserse yourself in rich, crystal-clear audio with our cutting-edge headphones. Designed for the ultimate listening experience, whether you're a casual listener or an audiophile. Discover the perfect blend of style, comfort, and sound quality that elevates your music to new heights.",
      buttonLabel: 'Discover Capybara',
    },
    banner2: {
      pretitle: 'The Future of Aerial Photography',
      title: 'Drone Omega',
      description:
        "A lightweight drone designed for stunning aerial footage. With a high-resolution camera on a 3-axis gimbal and up to 45 minutes of flight time, it's perfect for capturing smooth, stable video. Featuring GPS-assisted hover, obstacle avoidance, and easy portability, the Drone brings innovation and simplicity to your aerial shots.",
      buttonLabel: 'Discover Omega',
    },
  },
  textcard: {
    welcome: {
      pretitle: 'Welcome to your new favorite shop',
      title: 'Discover Tech & Style',
      subtitle: 'Innovative technology meets modern fashion',
      description:
        "<p>Welcome to our shop, where tech enthusiasts and fashion lovers alike will find exactly what they're looking for! From premium headphones and high-performance drones to stylish clothing, we offer everything to make your life smarter and your style unique.</p><p>Our mission is to provide you with a carefully curated selection of products that combine quality, innovation, and design. Whether you're in search of a new speaker for perfect sound or a casual hoodie to complete your look – we've got you covered.</p>",
      buttonLabel: 'Get shopping',
    },
  },
  multigrid: {
    textcard: {
      pretitle: '',
      title: 'A New Listening Experience',
      subtitle: 'Innovative technology meets modern fashion',
      description:
        "<p>Our headphone collection sets new standards in audio precision. With deep bass, crystal-clear highs, and an impressive soundstage, these headphones deliver a unique listening experience for every music genre. Combining modern design, maximum comfort, and cutting-edge technology, they are the perfect choice for anyone who refuses to compromise on sound quality.</p><ul class='list-disc pl-4 mt-4 space-y-1'><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul>",
      buttonLabel: 'To our headphones',
    },
    image: {
      alt: 'Headphones',
    },
  },
  productRecommended: {
    fashion: {
      pretitle: 'More than just technology',
      title: 'Discover our fashion collection',
      subtitle: 'Sporty fashion and accessories for everyone.',
      description: "<a name=underline href='https://plentyshop.plentymarkets.com/wear'>To our full collection.</a>",
    },
  },
  newsletter: {
    title: 'Newsletter',
    description: 'Be aware of upcoming sales and events. Receive gifts and special offers!',
    buttonLabel: 'Subscribe',
  },
};

export default content;
