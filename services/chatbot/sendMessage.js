import { httpsCallable } from 'firebase/functions';
import { useContext } from 'react';

import { AuthContext } from '@/providers/GlobalProvider';
import { setError, setStreaming, setTyping } from '@/redux/slices/chatSlice';
import { functions } from '@/redux/store';

const sendMessage = async (payload, dispatch, handleOpenSnackBar) => {
  try {
    const sendCommunication = httpsCallable(functions, 'chat');
    const response = await sendCommunication(payload);

    return response.data;
  } catch (err) {
    dispatch(setError('Error! Couldn\u0027t send message'));
    dispatch(setStreaming(false));
    dispatch(setTyping(false));
    setTimeout(() => {
      dispatch(setError(null));
    }, 3000);
    console.error('Error could not send message', err);
    alert('Error could not send message');
  }
};

export default sendMessage;
