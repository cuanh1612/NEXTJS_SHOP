import { ICategory } from '@/models/common';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, HStack, IconButton, Spacer } from '@chakra-ui/react';
import * as React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { GrDocumentUpdate } from 'react-icons/gr';


export interface ICategoriesItemProps {
    category: ICategory,
    handleEditCategory: (category: ICategory) => void,
    deleteCategory: (idDelete: string) => void,
    loading: boolean
}

export default function CategoriesItem({ category, handleEditCategory, deleteCategory, loading }: ICategoriesItemProps) {
    //Setup dialog delete user
    const [isOpen, setIsOpen] = React.useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()

    return (
        <>
            <Flex border="1px solid teal" padding="10px" marginTop="10px" borderRadius="md">
                <HStack>
                    <Box fontWeight="semibold">
                        {category.name}
                    </Box>
                </HStack>
                <Spacer />
                <HStack>
                    <IconButton
                        variant="outline"
                        colorScheme="teal"
                        aria-label="Update Category"
                        icon={<GrDocumentUpdate />}
                        onClick={() => handleEditCategory(category)}
                    />
                    <IconButton
                        variant="outline"
                        colorScheme="red"
                        aria-label="Delete Category"
                        icon={<AiOutlineDelete />}
                        onClick={() => setIsOpen(true)}
                    />
                </HStack>
            </Flex>


            {/* Dialog display when user enter delete button */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef as React.RefObject<any>}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Category <Box as="span" color="tomato">{category._id}</Box> :
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`Are you sure? You can't undo this action afterwards.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as React.LegacyRef<any>} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button isLoading={loading} colorScheme='red' onClick={() => deleteCategory(category._id)} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
