import axios from 'axios';

const submitPrompt = async (payload) => {
  try {
    console.log('Sending request to endpoint with payload:', payload);
    const url = `${process.env.NEXT_PUBLIC_MARVEL_ENDPOINT}submit-tool`;

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'API-Key': 'dev',
      },
    });

    console.log('Response from endpoint:', response.data);
    return response.data?.data;
  } catch (err) {
    const { response } = err;
    console.error('Error sending request:', err);
    throw new Error(
      response?.data?.message || `Error: could not send prompt, ${err}`
    );
  }
};

export default submitPrompt;
