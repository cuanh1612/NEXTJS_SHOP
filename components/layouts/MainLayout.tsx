import NavBar from '@/components/common/NavBar';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth } from '@/reduxState/store';
import { Container } from '@chakra-ui/react';
import * as React from 'react';

export interface IMainLayout {
  children: React.ReactNode
}

export function MainLayout({ children }: IMainLayout) {
  //Selector state
  const { currentUser } = useAppSelector(selectAuth)

  return (
    <Container maxW="container.xl">
      <NavBar currentUser={currentUser} />
      <div>
        {children}
      </div>
    </Container>
  );
}
