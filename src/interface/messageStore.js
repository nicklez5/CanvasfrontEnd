import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';
export const messageStore = { message: {
    id: 0,
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
            actions.setMessage(response.data)
            actions.setError(null)
        }catch(error){
            console.error("Request failed:", error.response?.status);
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
            const response = await api.post(`/threads/add/${threadId}/messages/`, messageData);
            actions.setMessage(response.data)
            // Add the message to the thread in the course's state
            courseStoreActions.addMessageToThread({
                courseId: courseId,
                threadId: threadId,
                message: response.data,  // The new message created in the backend
            });

            actions.setError(null);
            return { success: true };  // Clear error
        } catch (err) {
            actions.setError(err.message);  // Handle error
            console.error("Failed to update Message:", err);
            return { success: false, error: err.response?.data || err.message };
        } finally {
            actions.setLoading(false);
        }
    }),
    updateMessage: thunk(async (actions, { threadId, messageId, messageData, courseId,courseStoreActions }) => {

        actions.setLoading(true);
        try {
            const response = await api.put(`/threads/update/${threadId}/messages/${messageId}/`, messageData);
            actions.setMessage(response.data)
            // Update the message in the thread within the course state
            courseStoreActions.updateMessageInThread({
                courseId: courseId,
                threadId: threadId,
                messageId: messageId,
                updatedMessage: response.data,
            });

            actions.setError(null);
            return { success: true }; // Clear error
        } catch (err) {
            actions.setError(err.message);  // Handle error
            console.error("Failed to update Message:", err);
            return { success: false, error: err.response?.data || err.message };
        } finally {
            actions.setLoading(false);
        }
    }),
    deleteMessage: thunk(async (actions, { threadId, messageId, courseId,courseStoreActions }) => {
        actions.setLoading(true);
        try {
            courseStoreActions.removeMessageFromThread({
                courseId: courseId,
                threadId: threadId,
                messageId: messageId,
            });
            await api.delete(`/threads/delete/${threadId}/messages/${messageId}/`);
            actions.setMessage({})
            // Remove the message from the thread in the course state
            actions.setError(null);
            return { success: true };
        } catch (err) {
            console.log(err.message)
            actions.setError(err.message); 
            return { success: false, error: err.response?.data || err.message };// Handle error
        } finally {
            actions.setLoading(false);
        }
    }),
}