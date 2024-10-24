import axios from 'axios';

const submitPrompt = async (payload, files) => {
  try {
    console.log('submitPrompt payload', payload);
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    console.log('submitPrompt HERE 2');

    if (!!files && files?.length > 0) {
      console.log('submitPrompt HERE 3');
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    }

    const url = process.env.NEXT_PUBLIC_MARVEL_ENDPOINT;

    console.log('submitPrompt HERE 4', url, formData);

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('submitPrompt HERE 5');

    return response.data?.data;
  } catch (err) {
    const { response } = err;
    throw new Error(
      response?.data?.message || `Error: could not send prompt, ${err}`
    );
  }
};

export default submitPrompt;
