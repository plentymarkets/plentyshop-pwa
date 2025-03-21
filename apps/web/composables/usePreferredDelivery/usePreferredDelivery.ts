import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

export const usePreferredDelivery = () => {
  const { $i18n } = useNuxtApp();

  const state = useState('usePreferredDelivery', () => ({
    loading: false,
    data: {
      days: Array<{ date: string; dayNumber: string; dayName: string }>(),
      day: {
        checked: false,
        value: '',
      },
      location: {
        checked: false,
        value: '',
      },
      neighbour: {
        checked: false,
        name: '',
        address: '',
      },
    },
  }));

  const validationSchema = toTypedSchema(
    object({
      location: object({
        value: string().when([], {
          is: () => state.value.data.location.checked,
          then: () => string().required($i18n.t('PreferredDelivery.general.preferredLocationAlertMessage')).default(''),
          otherwise: () => string().optional().default(''),
        }),
      }),
      neighbour: object({
        name: string().when([], {
          is: () => state.value.data.neighbour.checked,
          then: () =>
            string()
              .required($i18n.t('PreferredDelivery.general.preferredNeighbourNameAlertMessage'))
              .test(
                'is-valid-neighbour-name',
                $i18n.t('PreferredDelivery.general.preferredNeigbourMaxCharViolation'),
                (name: string) => name.length <= 100,
              )
              .default(''),
          otherwise: () => string().optional().default(''),
        }),
        address: string().when([], {
          is: () => state.value.data.neighbour.checked,
          then: () =>
            string()
              .required($i18n.t('PreferredDelivery.general.preferredNeighbourAddressMessage'))
              .test(
                'is-valid-neighbour-address',
                $i18n.t('PreferredDelivery.general.preferredNeigbourMaxCharViolation'),
                (address: string) => address.length <= 100,
              )
              .default(''),
          otherwise: () => string().optional().default(''),
        }),
      }),
    }),
  );

  const dayCheckboxChange = () => {
    if (state.value.data.day.checked && state.value.data.day.value === '') {
      state.value.data.day.value = state.value.data.days[1].date;
      return;
    }

    if (!state.value.data.day.checked && state.value.data.day.value !== '') {
      state.value.data.day.value = state.value.data.days[0].date;
      return;
    }
  };

  const getPreferredDays = () => {
    state.value.data.days = [
      {
        date: '',
        dayNumber: '',
        dayName: $i18n.t('PreferredDelivery.general.wunschtagNone'),
      },
      {
        date: '2025-03-19',
        dayNumber: '19',
        dayName: $i18n.t('PreferredDelivery.general.days.Wednesday'),
      },
      {
        date: '2025-03-20',
        dayNumber: '20',
        dayName: $i18n.t('PreferredDelivery.general.days.Thursday'),
      },
      {
        date: '2025-03-21',
        dayNumber: '21',
        dayName: $i18n.t('PreferredDelivery.general.days.Friday'),
      },
      {
        date: '2025-03-24',
        dayNumber: '24',
        dayName: $i18n.t('PreferredDelivery.general.days.Monday'),
      },
      {
        date: '2025-03-25',
        dayNumber: '25',
        dayName: $i18n.t('PreferredDelivery.general.days.Tuesday'),
      },
    ];
  };

  const handleDayChange = (dayIndex: number) => {
    if (dayIndex === 0) {
      state.value.data.day.checked = false;
      state.value.data.day.value = '';
      return;
    }

    const selectedDay = state.value.data.days[dayIndex];

    if (selectedDay && state.value.data.day.value !== selectedDay.date) {
      state.value.data.day.value = selectedDay.date;
      state.value.data.day.checked = true;
    }
  };

  const isDayDisabled = (dayIndex: number) => {
    const selectedDay = state.value.data.days[dayIndex];
    return false;
  };

  const isDayChecked = (dayIndex: number) => {
    const selectedDay = state.value.data.days[dayIndex];
    return selectedDay && !isDayDisabled(dayIndex) && selectedDay.date === state.value.data.day.value;
  };

  return {
    validationSchema,
    dayCheckboxChange,
    getPreferredDays,
    handleDayChange,
    isDayDisabled,
    isDayChecked,
    ...toRefs(state.value),
  };
};
