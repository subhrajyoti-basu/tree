"use client"
import CollapsibleTree2 from '@/components/CollapsibleTree2'
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const ref = useRef<any>(null);
  const [size, setSize] = useState();
  useEffect(() => {
    setSize(ref?.current?.offsetWidth);
  }, [ref]);
  return (
    <div style={{maxWidth: "1400px", paddingLeft: "12px", paddingRight: "12px", margin: "auto"}}>  
    <div ref={ref}>
      {size && <CollapsibleTree2 width={size} />}
      {/* <TreeMap2 /> */}
    </div>
    </div>)
  // return (

  //   <main>
  //     <CollapsibleTree2 />
  //   </main>
  // )
}
