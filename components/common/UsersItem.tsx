import { IUserInfor } from '@/models/common';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, Box, Button, Flex, HStack, IconButton, Td, Tooltip, Tr } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { MdOutlineDangerous } from 'react-icons/md'
import { GrDocumentUpdate } from 'react-icons/gr'
import { AiOutlineDelete } from 'react-icons/ai'

export interface IUserListProps {
  currentUser: Partial<IUserInfor>,
  index: number,
  user: IUserInfor
}

export default function UserList({ user, currentUser, index }: IUserListProps) {
  //Setup dialog delete user
  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  return (
    <>
      {
        <Tr key={user._id} className='item_table'>
          <Td fontWeight="medium">
            {index + 1}
          </Td>
          <Td>
            {user._id}
          </Td>
          <Td>
            <Avatar
              width="40px"
              height="40px"
              name='Dan Abrahmov'
              src={user.avatar}
            />
          </Td>
          <Td>
            {
              user.name
            }
          </Td>
          <Td>
            {
              user.email
            }
          </Td>
          <Td
            fontSize="20px"
            color={
              user.role === "admin"
                ? "green"
                : "tomato"
            }
          >
            {
              user.role === "admin"
                ? (
                  user.root
                    ? (
                      <Flex>
                        <BsCheckLg />
                        <Box fontSize="16px" marginLeft="5px">
                          Root
                        </Box>
                      </Flex>
                    )
                    : (
                      <BsCheckLg />
                    )
                )
                : <MdOutlineDangerous />
            }
          </Td>
          <Td>
            <HStack>

              <Link
                href={
                  currentUser.root
                    ? `/edit_user/${user._id}` : '#!'
                }
                passHref
              >
                <a>
                  <Tooltip label="Update User">
                    <IconButton
                      aria-label="Update User"
                      icon={<GrDocumentUpdate />}
                      colorScheme="teal"
                      variant="outline"
                    />
                  </Tooltip>
                </a>
              </Link>

              {
                currentUser.root
                  ? (
                    <Tooltip label="Delete User" >
                      <IconButton
                        aria-label="Delete user"
                        icon={<AiOutlineDelete />}
                        variant="outline"
                        colorScheme="red"
                        onClick={() => setIsOpen(true)}
                      />
                    </Tooltip>
                  )
                  : (
                    <></>
                  )
              }
            </HStack>
          </Td>
        </Tr>
      }


      {/* Dialog display when user enter delete button */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as React.RefObject<any>}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete User <Box as="span" color="tomato">{user._id}</Box> :
            </AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? You can't undo this action afterwards.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef as React.LegacyRef<any>} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
