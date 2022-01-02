import { IUserInfor } from '@/models/common';
import { Box, Flex, HStack, Spacer } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { AiOutlineShoppingCart } from "react-icons/ai";
import DrawerNavbar from './DrawerNavBar';
import MenuUser from './MenuUser';

interface INavBarProps {
  currentUser: IUserInfor | null
}

export default function NavBar({currentUser}: INavBarProps) {
  return (
    <>
      <Box paddingY="20px">
        <Flex>
          <Box>
            <HStack spacing="40px" height="100%">
              <Link href="/">
                <a aria-label="home">
                  <Box fontWeight="700" fontSize="20px" borderRight="1px solid black" paddingRight="40px" whiteSpace="nowrap">
                    Next Shop
                  </Box>
                </a>
              </Link>
              <Link href="/cart">
                <a aria-label="cart">
                  <HStack >
                    <Box>
                      Cart
                    </Box>
                    <AiOutlineShoppingCart />
                  </HStack>
                </a>
              </Link>
            </HStack>
          </Box>
          <Spacer />
          <Box>
            <HStack alignItems="center" spacing="40px">
              {
                currentUser
                  ? (
                    <>
                      <MenuUser user={currentUser} />
                    </>
                  )
                  : (
                    <>
                      <DrawerNavbar />
                    </>
                  )
              }
            </HStack>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
