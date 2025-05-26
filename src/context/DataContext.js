import { createContext , useState, useEffect} from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';
import { useStoreActions, useStoreState } from 'easy-peasy';
const DataContext = createContext({});

export const DataProvider = ({children}) => {
    const setCourses = useStoreActions((actions) => actions.setCourses)
    const [canvasCourses,setCanvasCourses] = useState([])
    const {id} = localStorage.getItem("pk")
    const {data, fetchError , isLoading} = useAxiosFetch(`http://localhost:8000/canvas/detail/${id}`)
    useEffect(() => {
        setCanvasCourses(data.list_courses);
    },[data])

    
    
      
    return (
        <DataContext.Provider value={{
            
            canvasCourses, setCanvasCourses, fetchError, isLoading
        }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataContext;