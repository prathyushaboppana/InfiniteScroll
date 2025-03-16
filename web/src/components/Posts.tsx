import React, { useRef,useCallback} from "react";
import useInfiniteScroll from "@shared/useInfiniteScroll";
import { FixedSizeList as List } from 'react-window'

const Posts = () => {
    const observer = useRef<IntersectionObserver | null>(null);
    const { data, loadMoreData, error,hasMoreData } = useInfiniteScroll(
      "https://jsonplaceholder.typicode.com/posts"
    );
    
    const lastPostElementRef = useCallback(
        (node: HTMLDivElement) => {
           
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMoreData ) {
                      
                      loadMoreData();
                    }
                },
                { threshold: 1 }
            );
            if (node) observer.current.observe(node);
        }, [loadMoreData,hasMoreData]
    );

    const Row = React.memo(({ index, style, data }) => {
        if (!data[index]) return null; // Ensure data exists
        return (
            <div style={style} className="post">
                <span className="post-id">{data[index].id}</span>
                <span className="post-title">{data[index].title}</span>
                <div className="post-body">{data[index].body}</div>
            </div>
        );
    });

    return (
        <>
            <List
                height={window.innerHeight-100} 
                itemCount={data.length + 1} 
                itemSize={150}
                width="100%"
                itemData={data}
            >
                {({ index, style }) => {
                    if (data.length ===  index +1)
                        return (
                            <div ref={lastPostElementRef} style={style} className="p-3 text-center">
                                { hasMoreData ? <p style={{backgroundColor:'green'}}>"Loading more..." </p> : <p style={{backgroundColor:'red'}}>"No more posts" </p>}
                              
                            </div>
                        );

                    return <Row index={index} style={style} data={data} />;
                }}
            </List>

          <span> { error && <p style={{backgroundColor:'red'}}> error while fetching data </p>} </span> 
          </>
        
    );
};

export default Posts;