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
            persist: true,
            action: {
                text: 'action',
                onClick: () => {},
            },
        });

        expect(data.value.length).toBe(1);
    });

    it('should remove a notification', () => {
        const { data, send } = useNotification();

        send({
            message: 'Test alert error with a longer message',
            type: 'negative',
            action: {
                text: 'action',
                onClick: () => {},
            },
        });

        expect(data.value.length).toBe(1);

        if (data.value[0].dismiss) {
            data.value[0].dismiss();
        }

        expect(data.value.length).toBe(0);
    });

    it('should clear all notifications', () => {
        const { data, send, clear } = useNotification();

        send({
            message: 'Test alert error with a longer message',
            type: 'negative',
            action: {
                text: 'action',
                onClick: () => {},
            },
        });

        expect(data.value.length).toBe(1);

        clear();

        expect(data.value.length).toBe(0);
    });

    it('should remove the oldest notification when the maximum number of notifications is reached', async () => {
        const { data, send } = useNotification();

        for (let i = 0; i < 6; i++) {
            send({
                message: 'Test positive message',
                type: 'positive',
                action: {
                    text: 'action',
                    onClick: () => {},
                },
            });
        }

        expect(data.value.length).toBe(5);
    });

    it('should remove a notification after default timeout', async () => {
        const { data, send } = useNotification();
        const defaultTimeout = 3000;

        send({
            message: 'Test positive message',
            type: 'positive',
            action: {
                text: 'action',
                onClick: () => {},
            },
        });

        expect(data.value.length).toBe(1);
        
        await new Promise((resolve) => setTimeout(resolve, defaultTimeout - 100));
        expect(data.value.length).toBe(1);

        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(data.value.length).toBe(0);
    });

    it('should not remove a negative notification after 10ms', async () => {
        const { data, send } = useNotification();

        send({
            message: 'Test negative message',
            type: 'negative',
            action: {
                text: 'action',
                onClick: () => {},
            },
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
            action: {
                text: 'action',
                onClick: () => {},
            },
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

        expect(data.value.length).toBe(1);

        if (data.value[0].action) {
            data.value[0].action.onClick();
        }

        expect(action).toHaveBeenCalled();
    });
});
