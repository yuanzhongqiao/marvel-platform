import { useState } from 'react';

import { Grid, Typography } from '@mui/material';

import ChatHistoryButtonIcon from '@/assets/svg/ChatHistoryButtonIcon.svg';
import ChatIcon from '@/assets/svg/ChatIcon.svg';
import ChatIconFill from '@/assets/svg/ChatIconFill.svg';

import ChatHistory from '../ChatHistory/ChatHistory';

import styles from './styles';

/**
 * ChatHistoryWindow component displays a sidebar that contains chat history.
 * The sidebar is toggled by clicking on the toggle button.
 */
const ChatHistoryWindow = () => {
  // State variable to track whether the chat history is shown or hidden. Initially set to false.
  const [showHistory, setShowHistory] = useState(false);

  /**
   * Toggles the visibility of the chat history.
   *
   * @return {void} No return value.
   */
  const toggleHistory = () => setShowHistory((prev) => !prev);

  return (
    <Grid {...styles.chatHistoryWindow}>
      <Grid {...styles.chatHistoryHeader(showHistory)}>
        <Grid {...styles.chatHistoryHeaderTitleContainer}>
          <Grid>{showHistory ? <ChatIconFill /> : <ChatIcon />}</Grid>
          <Typography {...styles.chatHistoryHeaderTitleText}>
            Chat History
          </Typography>
        </Grid>
        <Grid
          {...styles.chatHistoryHeaderButton(showHistory)}
          onClick={() => toggleHistory()}
        >
          <ChatHistoryButtonIcon />
        </Grid>
      </Grid>
      <Grid {...styles.chatHistoriesContainer(showHistory)}>
        {showHistory ? <ChatHistory /> : null}
      </Grid>
    </Grid>
  );
};

export default ChatHistoryWindow;
