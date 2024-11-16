import { useContext } from 'react';

import { Help } from '@mui/icons-material';
import { Grid, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { FormContainer, useForm, useWatch } from 'react-hook-form-mui';
import { useDispatch, useSelector } from 'react-redux';

import GradientOutlinedButton from '@/components/GradientOutlinedButton';
import PrimaryFileUpload from '@/components/PrimaryFileUpload';
import PrimarySelectorInput from '@/components/PrimarySelectorInput';
import PrimaryTextFieldInput from '@/components/PrimaryTextFieldInput';

import { INPUT_TYPES } from '@/constants/inputs';
import ALERT_COLORS from '@/constants/notification';

import styles from './styles';

import evaluateCondition from './utils/evaluateCondition';

import { AuthContext } from '@/providers/GlobalProvider';
import {
  setCommunicatorLoading,
  setFormOpen,
  setPrompt,
  setResponse,
} from '@/redux/slices/toolsSlice';
import { firestore } from '@/redux/store';
import { fetchToolHistory } from '@/redux/thunks/toolHistory';
import submitPrompt from '@/services/tools/submitPrompt';

const ToolForm = (props) => {
  const { id, inputs } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const { handleOpenSnackBar } = useContext(AuthContext);
  const { communicatorLoading } = useSelector((state) => state.tools);
  const { data: userData } = useSelector((state) => state.user);

  // Extract default values from inputs
  const defaultValues = inputs.reduce((acc, input) => {
    if (input.defaultValue !== undefined) {
      acc[input.name] = input.defaultValue;
    }
    return acc;
  }, {});

  const { register, control, handleSubmit, setValue, errors } = useForm({
    defaultValues,
  });
  const watchedValues = useWatch({ control });

  const handleSubmitMultiForm = async (values) => {
    try {
      const { files, ...toolData } = values;
      dispatch(setResponse(null));

      const updateData = Object.entries(toolData).map(([name, value]) => ({
        name,
        value,
      }));
      dispatch(
        setPrompt({
          ...values,
          files: files ? files.map((file) => file.name) : [],
        })
      ); // Only dispatch file names if files are present
      dispatch(setCommunicatorLoading(true));

      const response = await submitPrompt(
        {
          toolData: { toolId: id, inputs: updateData },
          type: 'tool',
          user: {
            id: userData?.id,
            fullName: userData?.fullName,
            email: userData?.email,
          },
        },
        files,
        dispatch
      );

      dispatch(setResponse(response?.data));
      dispatch(setFormOpen(false));
      dispatch(setCommunicatorLoading(false));
      dispatch(fetchToolHistory({ firestore }));
    } catch (error) {
      dispatch(setCommunicatorLoading(false));
      handleOpenSnackBar(
        ALERT_COLORS.ERROR,
        error?.message || 'Couldn\u0027t send prompt'
      );
    }
  };

  const renderTextInput = (inputProps) => {
    const { name: inputName, placeholder, tooltip, label } = inputProps;
    const renderLabel = () => (
      <Grid {...styles.textFieldLabelGridProps}>
        <Typography {...styles.labelProps(errors?.[inputName])}>
          {label}
        </Typography>
        {tooltip && (
          <Tooltip placement="top" title={tooltip} sx={{ ml: 1 }}>
            <Help />
          </Tooltip>
        )}
      </Grid>
    );

    return (
      <Grid key={inputName} {...styles.inputGridProps}>
        <PrimaryTextFieldInput
          id={inputName}
          name={inputName}
          title={renderLabel()}
          error={errors?.[inputName]}
          control={control}
          placeholder={placeholder}
          helperText={errors?.[inputName]?.message}
          validation={{
            required: 'Field is required',
          }}
          ref={register}
        />
      </Grid>
    );
  };

  const renderNumberInput = (inputProps) => {
    const { name: inputName, placeholder, tooltip, label } = inputProps;
    const renderLabel = () => (
      <Grid {...styles.textFieldLabelGridProps}>
        <Typography {...styles.labelProps(errors?.[inputName])}>
          {label}
        </Typography>
        {tooltip && (
          <Tooltip placement="top" title={tooltip} sx={{ ml: 1 }}>
            <Help />
          </Tooltip>
        )}
      </Grid>
    );

    return (
      <Grid key={inputName} {...styles.inputGridProps}>
        <PrimaryTextFieldInput
          id={inputName}
          name={inputName}
          title={renderLabel()}
          error={errors?.[inputName]}
          control={control}
          placeholder={placeholder}
          helperText={errors?.[inputName]?.message}
          validation={{
            required: 'Field is required',
          }}
          ref={register}
        />
      </Grid>
    );
  };

  const renderSelectorInput = (inputProps) => {
    const { name: inputName, label, placeholder, values } = inputProps;

    const renderLabel = () => (
      <Grid {...styles.labelGridProps}>
        <Typography {...styles.labelProps(errors?.[inputName])}>
          {label}
        </Typography>
      </Grid>
    );

    return (
      <Grid key={inputName} {...styles.inputGridProps}>
        <PrimarySelectorInput
          id={inputName}
          name={inputName}
          label={renderLabel()}
          displayEmpty
          placeholder={placeholder}
          error={errors?.[inputName]}
          menuList={values.map((item) => ({
            id: item.key,
            label: item.label,
          }))}
          helperText={errors?.[inputName]?.message}
          control={control}
          ref={register}
          validation={{
            required: 'Please select an option.',
          }}
        />
      </Grid>
    );
  };

  const renderFileUpload = (inputProps) => {
    const { name: inputName, label } = inputProps;

    return (
      <Grid key={inputName} {...styles.inputGridProps}>
        <PrimaryFileUpload
          id={inputName}
          name={inputName}
          multiple
          placeholder="Choose Files to Upload"
          label={label}
          error={errors?.[inputName]}
          helperText={errors?.[inputName]?.message}
          color="purple"
          bgColor="#23252A"
          control={control}
          getValues={() => watchedValues}
          ref={register}
          showChips
          showCheckbox
          displayEmpty
          setValue={setValue}
          validation={{
            required: 'Please upload a file.',
            validate: {
              lessThanThree: (v) =>
                parseInt(v?.length, 10) < 10 || 'Should be less than 3 files',
            },
          }}
        />
      </Grid>
    );
  };

  const renderTextContent = (inputProps) => {
    const { content } = inputProps;
    return (
      <Grid
        key={content}
        {...styles.textContentGridProps}
        container
        justifyContent="center"
      >
        <Typography {...styles.textContentProps} align="center">
          {content}
        </Typography>
      </Grid>
    );
  };

  const renderActionButtons = () => (
    <Grid mt={4} {...styles.actionButtonGridProps}>
      <GradientOutlinedButton
        id="submitButton"
        bgcolor={theme.palette.Common.White['100p']}
        text="Generate"
        textColor={theme.palette.Common.White['100p']}
        loading={communicatorLoading}
        onHoverTextColor={theme.palette.Background.purple}
        type="submit"
        inverted
        {...styles.submitButtonProps}
      />
    </Grid>
  );

  const renderInput = (inputProps) => {
    const { condition, type } = inputProps;

    if (
      !evaluateCondition(
        condition,
        watchedValues,
        type === INPUT_TYPES.TEXT_CONTENT
      )
    ) {
      return null;
    }

    switch (type) {
      case INPUT_TYPES.TEXT:
        return renderTextInput(inputProps);
      case INPUT_TYPES.NUMBER:
        return renderNumberInput(inputProps);
      case INPUT_TYPES.FILE:
        return renderFileUpload(inputProps);
      case INPUT_TYPES.SELECT:
        return renderSelectorInput(inputProps);
      case INPUT_TYPES.TEXT_CONTENT:
        return renderTextContent(inputProps);
      default:
        return null;
    }
  };

  return (
    <FormContainer
      FormProps={{
        id: 'tool-form',
      }}
      onSuccess={handleSubmit(handleSubmitMultiForm)}
    >
      <Grid {...styles.formProps}>
        <Grid {...styles.mainContentGridProps}>
          {inputs?.map((input) => renderInput(input))}
        </Grid>
        {renderActionButtons()}
      </Grid>
    </FormContainer>
  );
};

export default ToolForm;
