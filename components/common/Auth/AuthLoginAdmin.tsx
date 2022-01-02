import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth } from '@/reduxState/store';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface IAppProps {
    children: any;
}

export default function App({ children }: IAppProps) {
    //Router
    const router = useRouter()

    //Get infor of user
    const { currentUser } = useAppSelector(state => selectAuth(state))

    //Check loged, if loged return home
    React.useEffect(() => {
        if (!currentUser) {
            router.push('/signin')
        }
    }, [currentUser, router])

    //Check role
    React.useEffect(() => {
        if (currentUser?.role !== 'admin') {
            router.push('/')
        }
    }, [currentUser, router])

    //If loged render load and wait useeffect push to home
    return (
        <>
            {(!currentUser || currentUser.role !== "admin")
                ? (
                    <>
                        <Loading />
                    </>
                )
                : (
                    <>
                        {
                            children
                        }
                    </>
                )
            }
        </>
    );
}
