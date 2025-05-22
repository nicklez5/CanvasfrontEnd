import { createContext , useState, useEffect} from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';
const DataContext = createContext({});
export const DataProvider = ({children}) => {
    const [courses, setCourses] = useState([])
    const [canvasCourses,setCanvasCourses] = useState([])
    const {id} = localStorage.getItem("pk")
    const {data1, fetchError1, isLoading1} = useAxiosFetch(`http://localhost:8000/courses/`)
    const {data, fetchError , isLoading} = useAxiosFetch(`http://localhost:8000/canvas/detail/${id}`)
    useEffect(() => {
        setCanvasCourses(data.list_courses);
    },[data])

    useEffect(() => {
        setCourses(data1)
    },[data1])

    
    
      
    return (
        <DataContext.Provider value={{
            courses, setCourses, fetchError1, isLoading1,
            canvasCourses, setCanvasCourses, fetchError, isLoading
        }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataContext;