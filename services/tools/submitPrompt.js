import axios from 'axios';
import { firestore } from '../../firebase/firebaseSetup'; // Import the existing Firestore instance
import { collection, addDoc, Timestamp } from 'firebase/firestore';

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

    // Safely extract the topic from inputs
    const topicInput = payload.tool_data.inputs.find((input) => input.name === 'topic');
    const topic = topicInput ? topicInput.value : null;

    // Extract necessary data for Firestore
    const sessionData = {
      response: response.data.data,
      toolId: payload.tool_data.tool_id, // Extract toolId from tool_data
      topic, // Use the safely extracted topic
      userId: payload.user.id, // Extract userId from user
    };

    // non-blocking: Save the response to Firestore
    saveResponseToFirestore(sessionData);

    return response.data?.data;
  } catch (err) {
    const { response } = err;
    console.error('Error sending request:', err);
    throw new Error(
      response?.data?.message || `Error: could not send prompt, ${err}`
    );
  }
};

/**
 * Save the tool session response to Firestore
 * @param {object} sessionData - The data to be saved to Firestore
 */
const saveResponseToFirestore = async (sessionData) => {
  try {
    const toolSessionRef = await addDoc(collection(firestore, 'toolSessions'), {
      ...sessionData,
      createdAt: Timestamp.fromMillis(Date.now()),
    });
    console.log(`Tool session saved with ID: ${toolSessionRef.id}`);
  } catch (error) {
    console.error('Error saving tool session to Firestore:', error);
  }
};

export default submitPrompt;
