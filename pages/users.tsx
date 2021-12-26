import { MainLayout } from '@/layouts';
import { NextPageWithLayout } from '@/models/common';
import * as React from 'react';

export interface IUsersProps {
}

const Users: NextPageWithLayout =  (props: IUsersProps) => {
  return (
    <div>
       User Page
    </div>
  );
}

Users.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

Users.typeAuth = "loged"

export default Users