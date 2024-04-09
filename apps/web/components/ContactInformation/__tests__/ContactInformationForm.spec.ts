import { mount } from '@vue/test-utils';
import { ContactInformationForm } from '#components';

describe('<ContactInformationForm />', () => {
  it('should render component', () => {

    const { getByTestId } = mount(ContactInformationForm);

    expect(getByTestId('contact-information-form'));   
  });
});