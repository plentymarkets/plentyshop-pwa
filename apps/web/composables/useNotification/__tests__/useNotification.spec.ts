import { useNotification } from '../useNotification';

describe('useNotification', () => {

    afterEach(() => {
        const { clear } = useNotification();
        clear();
    });

    it('should return the correct initial state', () => {
        const { data, send } = useNotification();

        expect(data.value).toEqual([]);
        expect(send).toBeInstanceOf(Function);
    });

    it('should add a notification', () => {
        const { data, send } = useNotification();

        send({
            message: 'Test alert error with a longer message',
            type: 'negative',
            persist: true
        });

        expect(data.value.length).toBe(1);
    });

    it('should remove a notification', () => {
        const { data, send } = useNotification();

        send({
            message: 'Test alert error with a longer message',
            type: 'negative',
        });

        expect(data.value.length).toBe(1);

        if (data.value[0].dismiss) {
            data.value[0].dismiss();
        }

        expect(data.value.length).toBe(0);
    });

    it('should clear all notifications', () => {
        const { data, send, clear } = useNotification();

        for (let i = 0; i < 5; i++) {
            send({
                message: 'Test alert error with a longer message',
                type: 'negative',
            });
        }

        expect(data.value.length).toBe(5);

        clear();

        expect(data.value.length).toBe(0);
    });

    it('should remove the oldest notification when the maximum number of notifications is reached', async () => {
        const { data, send } = useNotification();

        for (let i = 0; i < 6; i++) {
            send({
                message: `Message ${i}`,
                type: 'positive',
            });
        }

        expect(data.value[0].message).toBe('Message 1');
        expect(data.value.length).toBe(5);
    });

    it('should remove a notification after default timeout (3000ms)', async () => {
        const { data, send } = useNotification();

        send({
            message: 'Test positive message',
            type: 'positive',
        });

        expect(data.value.length).toBe(1);
        
        await new Promise((resolve) => setTimeout(resolve, 2000));
        expect(data.value.length).toBe(1);

        await new Promise((resolve) => setTimeout(resolve, 1100));
        expect(data.value.length).toBe(0);
    });

    it('should not remove a negative notification after 10ms', async () => {
        const { data, send } = useNotification();

        send({
            message: 'Test negative message',
            type: 'negative',
            dismissTimeout: 10
        });

        expect(data.value.length).toBe(1);

        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(data.value.length).toBe(1);
    });

    it('should not remove a persist notification after 10ms', async () => {
        const { data, send } = useNotification();

        send({
            message: 'Test persist message',
            type: 'positive',
            persist: true,
            dismissTimeout: 10
        });

        expect(data.value.length).toBe(1);

        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(data.value.length).toBe(1);
    });

    it('should call the action function of a notification', () => {
        const { data, send } = useNotification();
        const action = vi.fn();

        send({
            message: 'Test alert error with a longer message',
            type: 'negative',
            persist: true,
            action: {
                text: 'action',
                onClick: action,
            },
        });

        if (data.value[0].action) {
            data.value[0].action.onClick();
        }

        expect(action).toHaveBeenCalled();
    });
});
