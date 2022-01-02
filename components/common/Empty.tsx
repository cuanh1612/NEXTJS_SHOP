import { AspectRatio, Box, Center, Image } from '@chakra-ui/react';
import * as React from 'react';

export interface IEmptyProps {
    content: string
}

export default function Empty({ content }: IEmptyProps) {
    return (
        <Box>
            <AspectRatio maxW='500px' ratio={1} marginX="auto">
                <Image
                    alt='Image empty'
                    src='/papery-empty.png'
                    objectFit='cover'
                />
            </AspectRatio>
            <Center>
                <Box fontSize="25px" fontWeight="semibold">
                    {content}
                </Box>
            </Center>
        </Box>
    );
}
