import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';
export const messageStore = { message: {
    id: "",
    author: "",
    body: "",
    timestamp: ''
},
    loading: false,
    error: null,
    setMessage:action((state,payload) => {
        state.message = payload
    }),
    fetchMessage: thunk(async(actions, messageID ) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/messages/detail/${messageID}/`)
            
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            actions.setMessage(response.data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
        }finally{
            actions.setLoading(false)
        }

    }),
    setLoading: action((state,payload) => {
        state.loading = payload;
    }),
    setError: action((state,payload) => {
        state.error = payload
    }),
    createMessage: thunk(async (actions, { threadId, messageData, courseId, courseStoreActions }) => {
        actions.setLoading(true);
        try {
            const response = await api.post(`/threads/${threadId}/messages/`, messageData);

            // Add the message to the thread in the course's state
            courseStoreActions.addMessageToThread({
                courseId: courseId,
                threadId: threadId,
                message: response.data,  // The new message created in the backend
            });

            actions.setError(null);  // Clear error
        } catch (err) {
            actions.setError(err.message);  // Handle error
        } finally {
            actions.setLoading(false);
        }
    }),
    updateMessage: thunk(async (actions, { threadId, messageId, messageData, courseId,courseStoreActions }) => {
        const data = {
            body: messageData
        }
        actions.setLoading(true);
        try {
            const response = await api.put(`/threads/${threadId}/messages/${messageId}/`, data);

            // Update the message in the thread within the course state
            courseStoreActions.updateMessageInThread({
                courseId: courseId,
                threadId: threadId,
                messageId: messageId,
                updatedMessage: response.data,
            });

            actions.setError(null);  // Clear error
        } catch (err) {
            actions.setError(err.message);  // Handle error
        } finally {
            actions.setLoading(false);
        }
    }),
    deleteMessage: thunk(async (actions, { threadId, messageId, courseId,courseStoreActions }) => {
        actions.setLoading(true);
        try {
            await api.delete(`/threads/${threadId}/messages/${messageId}/`);

            // Remove the message from the thread in the course state
            courseStoreActions.removeMessageFromThread({
                courseId: courseId,
                threadId: threadId,
                messageId: messageId,
            });

            actions.setError(null);  // Clear error
        } catch (err) {
            actions.setError(err.message);  // Handle error
        } finally {
            actions.setLoading(false);
        }
    }),
}