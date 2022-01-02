import { Iorder } from '@/models/common';
import { Td, Tooltip, Tr } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { MdOutlineDangerous } from 'react-icons/md';

export interface IOrderItemProps {
    order: Iorder
}

export default function OrderItem({ order }: IOrderItemProps) {
    return (
        <Tr>
            <Td>

                <Link
                    href={{
                        pathname: '/order/[id]',
                        query: { id: order._id }
                    }}
                >
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
