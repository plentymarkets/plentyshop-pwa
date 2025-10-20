
interface ItemGridEntry {
  uuid: string;
  height: number;
}

const itemGridCollection = reactive<ItemGridEntry[]>([]);

export const useItemGridCollection = () => {
  const setItemGrid = (uuid: string, height: number) => {
    const existingEntry = itemGridCollection.find((entry) => entry.uuid === uuid);
    if (existingEntry) {
      existingEntry.height = height; 
    } else {
      itemGridCollection.push({ uuid, height }); 
    }
  };

  const removeItemGrid = (uuid: string) => {
    const index = itemGridCollection.findIndex((entry) => entry.uuid === uuid);
    if (index !== -1) {
      itemGridCollection.splice(index, 1); 
    }
  };

  const getItemGridCollection = () => itemGridCollection;

  return {
    setItemGrid,
    removeItemGrid,
    getItemGridCollection,
  };
};