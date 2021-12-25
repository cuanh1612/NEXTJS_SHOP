import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth } from '@/reduxState/store';
import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import Loading from '@/components/common/Loading'

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
    if (currentUser) {
      router.push('/')
    }
  }, [currentUser, router])

  //If loged render load and wait useeffect push to home
  return (
    <>
      {(currentUser)
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
