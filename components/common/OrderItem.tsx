import { Iorder } from '@/models/common';
import { IconButton, Td, Tooltip, Tr } from '@chakra-ui/react';
import * as React from 'react';
import { MdOutlineDangerous } from 'react-icons/md'
import { BsCheckLg } from 'react-icons/bs'
import Link from 'next/link';
import { AiOutlineEye } from 'react-icons/ai'

export interface IOrderItemProps {
    order: Iorder
}

export default function OrderItem({ order }: IOrderItemProps) {
    return (
        <Tr>
            <Td>
                <Link href={`/order/${order._id}`}>
                    <a>
                        <Tooltip label="Detail Order">
                            {order._id}
                        </Tooltip>
                    </a>
                </Link>
            </Td>
            <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
            <Td color="tomato">{order.total}$</Td>
            <Td
                fontSize="20px"
                color={
                    order.delivered
                        ? "green"
                        : "tomato"
                }
            >
                {
                    order.delivered
                        ? <BsCheckLg />
                        : <MdOutlineDangerous />
                }
            </Td>

            <Td
                fontSize="20px"
                color={
                    order.paid
                        ? "green"
                        : "tomato"
                }
            >
                {
                    order.paid
                        ? <BsCheckLg />
                        : <MdOutlineDangerous />
                }
            </Td>
        </Tr>
    );
}
