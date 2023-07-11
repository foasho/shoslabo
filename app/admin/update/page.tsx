'use client'
import React, { useState } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import Header from '@editorjs/header';
import List from '@editorjs/list'; 

const ReactEditorJS = createReactEditorJS();


const Page = () => {

  const [data, setData] = useState("");

  const handleChange = (e) => {
    setData(e.target.value);
  }

  return (
    <>
      <ReactEditorJS />
    </>
  )
}

export default Page;