import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import * as React from 'react';

export interface ILoadingProps {
}

export default function Loading(props: ILoadingProps) {
    return (
        <Box height="100vh">
            <Flex height="100%" justifyContent="center">
                <Center>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='teal.500'
                        size='xl'
                    />
                </Center>
            </Flex>
        </Box>
    );
}
