import { MainLayout } from '@/layouts';
import { NextPageWithLayout } from '@/models/common';
import Link from 'next/link';
import * as React from 'react';

const About: NextPageWithLayout = () => {
    return (
        <div>
            About page
            <Link href={'/product'}>
                <a>Product</a>
            </Link>
        </div>
    );
}

About.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export default About
