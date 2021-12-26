import { IUserInfor } from '@/models/common';
import { Avatar, Button, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import * as React from 'react';
import { BiChevronDown } from 'react-icons/bi';
import Cookie from 'js-cookie'
import { useRouter } from 'next/router';
import { UseToast } from '@/hooks';
import { useDispatch } from 'react-redux';
import { auth_logout_success } from '@/reduxState/actionTypes/authAction';
import Link from 'next/link';

export interface IMenuUserProps {
    user: IUserInfor
}

export default function MenuUser({ user }: IMenuUserProps) {
    //Config inform
    const toast = UseToast()

    //Router
    const router = useRouter()

    //Dispatch 
    const dispatch = useDispatch()

    //Handle Logout
    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: "/api/auth/accessToken" })
        localStorage.removeItem('firstLogin')
        dispatch(auth_logout_success())
        return router.push('/signin')
    }

    return (
        <Menu>
            <Tooltip label={user && user.name}>
                <MenuButton as={Button} variant="outline" colorScheme="teal" rightIcon={<BiChevronDown />}>
                    <Avatar size='sm' name='Dan Abrahmov' src={user && user.avatar} />
                </MenuButton>
            </Tooltip>
            <MenuList>
                <Link href="/profile" passHref>
                    <MenuItem>
                        <a>
                            Profile
                        </a>
                    </MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
                {
                    user.role === "admin" && (
                        <>
                            <MenuItem onClick={handleLogout}>Users</MenuItem>
                            <MenuItem onClick={handleLogout}>Products</MenuItem>
                            <MenuItem onClick={handleLogout}>Categories</MenuItem>
                        </>
                    )
                }
            </MenuList>
        </Menu>
    );
}
