import { Fade, Grid, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import styles from './styles';

const QuizResponse = () => {
  const { response } = useSelector((state) => state.tools);

  const hasTitle = false;

  const renderTitle = () => {
    return (
      <Grid {...styles.titleGridProps}>
        <Typography {...styles.titleProps}>No Title</Typography>
      </Grid>
    );
  };

  const renderQuestion = (question, questionNo) => {
    const { choices, question: questionTitle } = question;

    const questionChoices = Array.isArray(choices)
      ? choices
      : Object.values(choices || {});

    return (
      <Grid key={`question-${questionNo}`} {...styles.questionGridProps}>
        <Typography {...styles.questionTitleProps}>
          {questionNo}. {questionTitle}
        </Typography>
        <Grid>
          {questionChoices?.map((choice, index) => (
            <Typography
              key={`${questionNo}-choice-${index}`}
              {...styles.choiceProps}
            >
              {choice?.key}. {choice?.value}
            </Typography>
          ))}
        </Grid>
      </Grid>
    );
  };

  const renderQuestions = () => {
    return (
      <Grid {...styles.questionsGridProps}>
        {response?.map((question, i) => renderQuestion(question, i + 1))}
      </Grid>
    );
  };

  return (
    <Fade in>
      <Grid {...styles.mainGridProps}>
        {hasTitle && renderTitle()}
        {renderQuestions()}
      </Grid>
    </Fade>
  );
};
export default QuizResponse;
