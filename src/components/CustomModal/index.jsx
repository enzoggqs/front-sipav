import React from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

const CustomModal = ({ isOpen, onClose, initialRef, finalRef, maxW, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                {children}
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;
