import * as Dialog from "@radix-ui/react-dialog";
import { ListBulletIcon } from "@radix-ui/react-icons";

const EditProperties = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="p-0 px-1 bg-transparent border-none transition-colors hover:text-amber-500 duration-200">
          <ListBulletIcon height={20} width={20} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-90 fixed inset-0" />
        <Dialog.Content className="bg-white rounded fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-blue-700">Edit Properties</Dialog.Title>
          <Dialog.Description>This is a description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditProperties;
