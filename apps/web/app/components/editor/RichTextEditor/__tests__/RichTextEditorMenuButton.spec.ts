import { mount } from '@vue/test-utils';
import RichTextEditorMenuButton from '../RichTextEditorMenuButton.vue';

describe('RichTextEditorMenuButton', () => {
  it('should emit click when the button is clicked', async () => {
    const wrapper = mount(RichTextEditorMenuButton, {
      props: {
        iconName: 'link',
      },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
