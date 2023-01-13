import React from "react";
import "./styles.css";
import { List, Item, useListData, useObserver, changeList } from "./List";

export default function App() {
  const [count, setCount] = React.useState(0);
  const [target, setTarget] = React.useState(-1);
  const { listData, addPrev, addMore, change } = useListData();
  const { observerRef } = useObserver(listData);

  const handleAddPrev = () => {
    addPrev(count);
  };

  const handleAddMore = () => {
    addMore(count);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <input onChange={(e) => setCount(e.target.value)}></input>
      <div onClick={handleAddPrev}>add prev</div>
      <div onClick={handleAddMore}>add more</div>
      <div onClick={change}>change</div>
      <input onChange={(e) => setTarget(e.target.value)}></input>
      <List
        observerRef={observerRef}
        count={listData.length}
        rowRenderer={Item}
        scrollToIndex={target}
      />
    </div>
  );
}
