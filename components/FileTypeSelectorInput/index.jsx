import { Grid, Typography, Tooltip } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form-mui';
import { Help } from '@mui/icons-material';

import PrimaryFileUpload from '@/components/PrimaryFileUpload';
import PrimaryTextFieldInput from '@/components/PrimaryTextFieldInput';
import PrimarySelectorInput from '@/components/PrimarySelectorInput';

import styles from './styles';

const FileTypeSelectorInput = ({ name, label, fileTypes, tooltip, error, helperText, setValue, getValues, ref, control }) => {
  const selectedFileType = useWatch({ control });

  console.log('FileTypeSelectorInput name:', name);

  const renderLabel = (text) => (
    <Grid {...styles.labelGridProps}>
      <Typography {...styles.labelProps(error)}>{text}</Typography>
      {tooltip && (
        <Tooltip placement="top" title={tooltip} sx={{ ml: 1 }}>
          <Help />
        </Tooltip>
      )}
    </Grid>
  );

  const renderInputField = () => {
    const urlOnlyTypes = ['GOOGLE_DOCS', 'GOOGLE_SHEETS', 'GOOGLE_SLIDES', 'GOOGLE_DRIVE', 'URL'];
    console.log('selectedFileType:', selectedFileType[name]);

    if (urlOnlyTypes.includes(selectedFileType[name])) {
      return (
        <Grid item {...styles.inputGridProps}>
          <PrimaryTextFieldInput
            name={`${name}_url`}
            id={`${name}_url`}
            title={renderLabel("Type URL")}
            placeholder="Enter URL e.g http://..."
            control={control}
            error={error}
            helperText={helperText}
          />
        </Grid>
      );
    } else {
      return (
        <>
          {/* <Grid item {...styles.inputGridProps}>
            <PrimaryTextFieldInput
              name={`${name}_url`}
              id={`${name}_url`}
              title={renderLabel("URL")}
              placeholder="Enter URL e.g http://..."
              control={control}
              error={error}
              helperText={helperText}
            />
          </Grid>
          <Grid container justifyContent="center" alignItems="center" sx={{ my: 0, mb: 0 }}>
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Grid> */}
          <Grid item {...styles.inputGridProps} sx={{ marginTop: '-30px' }}>
            <PrimaryFileUpload
              name={`${name}_file`}
              id={`${name}_file`}
              title={renderLabel("Upload File")}
              control={control}
              setValue={setValue}
              error={error}
              helperText={helperText}
              multiple
              placeholder="Choose Files to Upload"
              showChips
              showCheckbox
              displayEmpty
              ref={ref}
              getValues={() => getValues()}
              color="purple"
              bgColor="#23252A"
            />
          </Grid>
        </>
      );
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item {...styles.inputGridProps}>
        <PrimarySelectorInput
          name={`${name}_type`}
          label={renderLabel(label)}
          control={control}
          menuList={fileTypes.map((type) => ({
            id: type.key,
            label: type.label,
          }))}
        />
      </Grid>
      {renderInputField()}
    </Grid>
  );
};

export default FileTypeSelectorInput; 