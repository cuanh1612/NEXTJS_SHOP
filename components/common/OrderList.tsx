import { Iorder } from '@/models/common';
import { Box, Table, TableCaption, Tbody, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import * as React from 'react';
import OrderItem from './OrderItem';

export interface IOrderListProps {
    orders: Iorder[]
}

export default function OrderList({orders}: IOrderListProps) {
    return (
        <Box border="1px solid teal" borderRadius="md" overflowX="auto">
            <Table variant='simple' >
                <TableCaption>Imperial to metric conversion factors</TableCaption>
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>DATE</Th>
                        <Th>TOTAL</Th>
                        <Th>DELIVERED</Th>
                        <Th>PAID</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        orders.map(order => (
                            <OrderItem key={order._id} order={order} />
                        ))
                    }

                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>ID</Th>
                        <Th>DATE</Th>
                        <Th>TOTAL</Th>
                        <Th>DELIVERED</Th>
                        <Th>PAID</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </Box>
    );
}
