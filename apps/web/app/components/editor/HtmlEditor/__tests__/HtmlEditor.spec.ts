import { mount } from '@vue/test-utils';
import HtmlEditor from '../HtmlEditor.vue';

const mountHtmlEditor = (props?: Record<string, unknown>) =>
    mount(HtmlEditor, {
        props: {
            modelValue: '<p>Initial</p>',
            ...props,
        },
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });

describe('HtmlEditor', () => {
    it('should render textarea with initial value and heading', () => {
        const wrapper = mountHtmlEditor();

        const heading = document.querySelector('[data-testid="html-editor-heading"]');
        expect(heading).not.toBeNull();

        const textarea = document.querySelector('[data-testid="html-editor-textarea"]') as HTMLTextAreaElement | null;
        expect(textarea).not.toBeNull();
        expect(textarea?.value).toBe('<p>Initial</p>');

        wrapper.unmount();
    });

    it('should update v-model when textarea changes', async () => {
        const wrapper = mountHtmlEditor();

        const textareaWrapper = wrapper.find('[data-testid="html-editor-textarea"]');
        await textareaWrapper.setValue('<p>Updated</p>');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['<p>Updated</p>']);

        wrapper.unmount();
    });

    it('should render validation errors when provided', () => {
        const errors = ['Error 1', 'Error 2'];

        const wrapper = mountHtmlEditor({
            modelValue: '',
            htmlErrors: errors,
        });

        const alert = document.querySelector('[data-testid="html-editor-errors"]');
        expect(alert).not.toBeNull();
        expect(alert?.textContent).toContain('Error 1');
        expect(alert?.textContent).toContain('Error 2');

        wrapper.unmount();
    });

    it('should emit close when close button is clicked', async () => {
        const wrapper = mountHtmlEditor({
            modelValue: '',
        });

        const closeButtonWrapper = wrapper.find('[data-testid="html-editor-close"]');
        await closeButtonWrapper.trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();

        wrapper.unmount();
    });

    it('should emit close when clicking on backdrop', async () => {
        const wrapper = mountHtmlEditor({
            modelValue: '',
        });

        const backdropWrapper = wrapper.find('div.fixed.inset-0');
        await backdropWrapper.trigger('click.self');

        expect(wrapper.emitted('close')).toBeTruthy();

        wrapper.unmount();
    });

    it('should emit close when Escape key is pressed', async () => {
        const wrapper = mount(HtmlEditor, {
            props: {
                modelValue: '',
            },
            attachTo: document.body,
        });

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);

        expect(wrapper.emitted('close')).toBeTruthy();

        wrapper.unmount();
    });
});
