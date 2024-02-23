import { Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const OpenFiles = ({ opene }: any) => {
  const [opened, { open, close }] = useDisclosure(opene);
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="This is a fullscreen modal"
      fullScreen
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      <div>OpenFiles</div>
    </Modal>
  );
};
export default OpenFiles;
