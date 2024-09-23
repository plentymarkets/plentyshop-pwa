export const getLocaleObject = () => {
  if (process.env.ACTIVELANGUAGEENGLISH === undefined) {
    process.env.ACTIVELANGUAGEENGLISH = 'true';
  }

  if (process.env.ACTIVELANGUAGEGERMAN === undefined) {
    process.env.ACTIVELANGUAGEGERMAN = 'true';
  }

  const localeObject = [];

  switch (`${process.env.ACTIVELANGUAGEENGLISH}-${process.env.ACTIVELANGUAGEGERMAN}`) {
    case 'true-false': {
      localeObject.push({
        code: 'en',
        file: 'en.json',
      });
      break;
    }
    case 'false-true': {
      localeObject.push({
        code: 'de',
        file: 'de.json',
      });
      break;
    }
    case 'true-true': {
      localeObject.push(
        {
          code: 'en',
          file: 'en.json',
        },
        {
          code: 'de',
          file: 'de.json',
        },
      );
      break;
    }
  }

  return localeObject;
};
