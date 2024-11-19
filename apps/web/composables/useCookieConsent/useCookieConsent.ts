export const useCookieConsent = (name: string) => {
  const state = useState('useCookieConsent_' + name, () => ({
    consent: false,
  }));

  const accept = () => {
    const { data, setConsent } = useReadCookieBar();

    data.value.groups.forEach((group) => {
      group.cookies.forEach((cookie) => {
        if (cookie.name === name) {
          cookie.accepted = true;
          setConsent();
        }
      });
    });
  };

  return {
    ...toRefs(state.value),
    accept,
  };
};
