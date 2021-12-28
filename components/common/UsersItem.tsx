import { IMessage, IUserInfor } from '@/models/common';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, Box, Button, Flex, HStack, IconButton, Td, Tooltip, Tr } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { MdOutlineDangerous } from 'react-icons/md'
import { GrDocumentUpdate } from 'react-icons/gr'
import { AiOutlineDelete } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { userDeleteItem } from '@/reduxState/asyncActions/usersAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectUsers } from '@/reduxState/store';
import { UseToast } from 'hooks/useToast';
import { users_message_clear } from '@/reduxState/actionTypes/usersAction';

export interface IUserListProps {
  currentUser: Partial<IUserInfor>,
  index: number,
  user: IUserInfor,
  accessToken: string,
}

export default function UserList({ user, currentUser, index }: IUserListProps) {
  //Toast hook
  const toast = UseToast()

  //Dispatch
  const dispatch = useDispatch()

  //Setup dialog delete user
  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  //Select data from redux
  const { users, loading } = useAppSelector(state => selectUsers(state))
  const { accessToken } = useAppSelector(state => selectAuth(state))

  //Handle delete User
  const deleteUser = async (id: string) => {
    dispatch(userDeleteItem(users, id, accessToken as string))
    //Delete database
  }

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


{/* Update usre button */}
              {
                currentUser.root
                  ? (
                    <Link
                      href={{
                        pathname:
                          `/edit_user/[id]`
                        ,
                        query: {
                          id: user._id
                        }
                      }}
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
                  )
                  : (
                    <></>
                  )
              }


{/* Delete usre button */}
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
              <Button isLoading={loading} colorScheme='red' onClick={() => deleteUser(user._id)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
