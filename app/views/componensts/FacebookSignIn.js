import React from 'react';
import { Button } from 'react-native';

function FacebookSignIn() {
  return (
    <Button
      title="Facebook Sign-In"
      onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
    />
  );
}

export default FacebookSignIn
