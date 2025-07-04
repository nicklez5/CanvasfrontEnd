import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';

import { assignmentStore } from './assignmentStore';
import { courseStore } from './courseStore';
import { lectureStore } from './lectureStore';
import { messageStore } from './messageStore';
import { testStore } from './testStore';
import { threadStore } from './threadStore';
import { userStore } from './userStore';
import { submissionStore} from './submissionStore'
const store = createStore({
    userStore: persist(userStore, {
        storage: localStorage,
        key: 'userStore'
    }),
    courseStore: persist(courseStore, {
        storage: localStorage,
        key: 'courseStore'
    }),
    lectureStore: persist(lectureStore, {
        storage: localStorage,
        key: 'lectureStore'
    }),
    messageStore: persist(messageStore, {
        storage: localStorage,
        key: 'messageStore'
    }),
    testStore: persist(testStore, {
        storage: localStorage,
        key: 'testStore'
    }),
    threadStore: persist(threadStore, {
        storage: localStorage,
        key: 'threadStore'
    }),
    assignmentStore: persist(assignmentStore, {
        storage: localStorage,
        key: 'assignmentStore'
    }),
    submissionStore: persist(submissionStore,{
        storage: localStorage,
        key: "submissionStore"
    })
})
export default store