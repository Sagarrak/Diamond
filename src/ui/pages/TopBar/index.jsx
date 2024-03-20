// library
import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, Button, Form, Label, Spinner } from 'reactstrap';
import { useMutation, useQuery } from "react-apollo";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { toast } from 'react-toastify';

import '@styles/react/libs/editor/editor.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// components
import { UPDATE_TOPBAR } from "./mutation";
import { GET_TOPBAR } from "./query";

const Index = () => {

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(false);
  const [content, setContent] = useState(EditorState.createEmpty());
  const [show, setShow] = useState(false);
  const [dataId, setDataId] = useState("");

  // query
  const { loading, data, refetch } = useQuery(GET_TOPBAR, {
    fetchPolicy: "cache-and-network"
  });

  // mutation
  const [updateTopBar] = useMutation(UPDATE_TOPBAR);

  let currentContentAsHTML = draftToHtml(convertToRaw(content.getCurrentContent()));

  useEffect(() => {
    if (data?.getTopBar) {
      setLoader(false);
      let array = data?.getTopBar?.content;
      const contentBlock = htmlToDraft(array);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const _editorState = EditorState.createWithContent(contentState);

      setContent(_editorState);
      setDataId(data?.getTopBar?.id);
    }
  }, [data]);

  let lengthOfData = data?.getTopBar?.content?.length;

  const updateSubmitHandler = () => {
    const input = {
      id: dataId,
      content: currentContentAsHTML,
    };
    setLoader(true);
    updateTopBar({ variables: { input } })
      .then(({ data }) => {
        if (data) {
          refetch();
          setModal(false);
          setLoader(false);
          toast.success("Data Save successfully");
        }
      })
      .catch(error => {
        toast.error("Data does not add");
      })
  };

  return (
    <Fragment>
      <Card className="w-100 h-100">
        <CardBody style={{ flex: "unset", height: "inherit" }}>

          <h2 style={{ textAlign: "center" }} > TopBar </h2>
          <Form className="auth-login-form mt-2">

            <div className='mb-1'>
              <Label className='form-content' htmlFor='content' style={{ fontSize: "15px" }}>
                Content <span className="text-danger">&#42;</span>
              </Label>
              <Editor
                editorState={content}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(data) => setContent(data)}
              />
            </div>
          </Form>
          {
            lengthOfData > 0 &&
            <Button className="button" style={{ marginLeft: "1310px" }} onClick={(e) => updateSubmitHandler(e)}>
              Submit
            </Button>
          }
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Index;