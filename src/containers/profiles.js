import React from 'react';
import { Header, Profiles } from '../components';
import * as ROUTES from '../constants/routes';
// import logo from '../logo.svg';
import logo from '../image2vector.svg'

export function SelectProfileContainer({ user, setProfile }) {

  let newAge = window.localStorage.getItem("age");
  let msg = Number(newAge) > 18 ? "Loaded for adults section" : "Loading for kids section";
  
  return (
    <>
      <Header bg={false}>
        <Header.Frame>
          <Header.Logo to={ROUTES.HOME} src={logo} alt="Netflix" />
        </Header.Frame>
      </Header>

      <Profiles>
        <Profiles.Title>Who's watching?</Profiles.Title>
        <Profiles.List>
          <Profiles.User onClick={() => setProfile({ displayName: user.displayName, photoURL: user.photoURL })}>
            <Profiles.Picture src={user.photoURL} />
            <Profiles.Name>{user.displayName}</Profiles.Name>
            <Profiles.Name>{msg}</Profiles.Name>
          </Profiles.User>
        </Profiles.List>
      </Profiles>
    </>
  );
}
