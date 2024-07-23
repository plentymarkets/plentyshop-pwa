import { useAddressStore } from './useAddressStore';
describe('useAddresses store', () => {

    it('Test', () => {
        const store = useAddressStore();
        store.$subscribe((mutation, state) => {
           console.log(mutation);
        });

        store.$onAction(({
            name, // name of the action
            store, // store instance, same as `someStore`
            args, // array of parameters passed to the action
          }) => {
            console.log(name);
        });


        store.get(1)
        store.deleteAddress(1);
        store.$patch({
            addresses: [{
                id: 1
            }],
        });
    });

});