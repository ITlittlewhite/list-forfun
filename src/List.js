import React from "react";
import "./List.css";

let l = [];

export function changeList() {
  return () => {};
}

export const useListData = () => {
  const [listData, setListData] = React.useState([]);

  const addPrev = (count) => {
    let a = new Array(count);
    let first = listData.length > 0 ? listData[0] : 0;
    for (let i = 0; i < count; i++) {
      a[i] = first - count + i;
    }
    setListData(a.concat(listData));
    l = a.concat(listData);
  };

  const addMore = (count) => {
    let a = new Array(count);
    let endIndex = listData.length - 1;
    let end = listData.length > 0 ? listData[endIndex] : 0;
    for (let i = 0; i < count; i++) {
      a[i] = end + i + 1;
    }
    setListData(listData.concat(a));
    l = listData.concat(a);
  };

  const change = () => {
    setListData([5, 1, 4, 3, 0]);
    l = [5, 1, 4, 3, 0];
  };

  return { listData, addPrev, addMore, change };
};

const Unit = React.memo((props) => {
  return (
    <div
      className="item"
      style={
        props.index % 2 === 0 ? { background: "red" } : { background: "blue" }
      }
    >
      {l[props.index]}
    </div>
  );
});

export const Item = (props) => {
  // const { listData } = useListData();
  const index = props.index;
  return <Unit key={index} index={index} />;
};

export const useResizeObserver = () => {
  const observerRef = React.useRef(null);
  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // console.log("resizeObserver", entry);
      }
    });
    resizeObserver.observe(observerRef.current);
  }, []);
  return { observerRef };
};

// observer
export const useObserver = (listData) => {
  const observerRef = React.useRef(null);
  const observer = React.useRef(null);

  React.useEffect(() => {
    observer.current = new IntersectionObserver(
      (entrys) => {
        entrys.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
          }
        });
      },
      { root: observerRef.current }
    );
  }, []);

  React.useEffect(() => {
    const childNodes =
      observerRef && observerRef.current && observerRef.current.childNodes;

    for (var i = 0; i < childNodes.length; i++) {
      childNodes[i].dataset.observed = "true";
      observer.current.observe(childNodes[i]);
    }
  }, [listData]);
  return { observerRef };
};

// 与业务相关的子组件集生成器
const useRangeRenderInMessageList = (props) => {
  const endIndex = props.count;
  // const getKey = props.getKey;

  // 通用的useRender
  return ({ rowRenderer }) => {
    let a = [];
    for (let rowIndex = 0; rowIndex < endIndex; rowIndex++) {
      a.push(rowRenderer({ index: rowIndex }));
    }
    return a;
  };
};

export const List = (params) => {
  const { observerRef: resizeObserver } = useResizeObserver();
  const scrollToIndex = params.scrollToIndex || -1;
  const rangeRender = useRangeRenderInMessageList({
    count: params.count
  });
  const listRenderer = rangeRender({ rowRenderer: params.rowRenderer });

  const scrollToTarget = React.useCallback(
    (scrollToIndex) => {
      if (scrollToIndex > -1 && resizeObserver.current) {
        console.log(resizeObserver.current);
        const target = resizeObserver.current.childNodes[scrollToIndex];
        target.scrollIntoView();
      }
    },
    [params.observerRef]
  );

  React.useEffect(() => {
    scrollToTarget(scrollToIndex);
  }, [scrollToIndex, scrollToTarget]);

  return (
    <div ref={params.observerRef} className={"container"}>
      <div ref={resizeObserver}>{listRenderer}</div>
    </div>
  );
};
