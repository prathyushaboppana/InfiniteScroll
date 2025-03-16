import { useState, useEffect, useCallback,useRef} from "react";
import  { fetchData }from './fetchData.ts';
import  {Post} from  './Post.ts';

const useInfiniteScroll = (endpoint:string) => {
  const [data, setData] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string>();
  const [hasMoreData,setHasMoreData] = useState<boolean>(true);
  const isFetching = useRef(false); 

  const loadMoreData = useCallback(async () => {
    if (!hasMoreData || isFetching.current) return; 
    isFetching.current = true;
    try {
      const newData = await fetchData(page, endpoint);
      if(newData.length > 0)
      {
      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
      }
      else{
        setHasMoreData(false)
      }
      isFetching.current = false;
    } catch (err) {
      setError('errror while fetching data' +err);
    }
  }, [page, endpoint,hasMoreData]);

  useEffect(() => {
    loadMoreData(); // Load initial data
  }, []);

  return { data, loadMoreData, error,hasMoreData };
};

export default useInfiniteScroll;