//library
import React from "react";
import { Button, Input, Label, Media } from "reactstrap";


const Index = ({ photo,onChangeImage,size, acceptFileType,}) => {
  return (
    <div>
      <Media className="d-flex">
        <Media left>
          <Media
            object
            className="rounded mr-50"
            src={photo}
            alt="Article image"
            height={size?size:"45"}
            width={size?size:"45"}
          />
        </Media>
        {onChangeImage && <Media className="d-flex align-items-center ms-1" body>
          <Button.Ripple
            tag={Label}
            className="mr-75"
            size="sm"
            color="primary"
          >
            Upload
            <Input
              type="file"
              onChange={(e) => onChangeImage(e)}
              hidden
              accept={acceptFileType}
            />
          </Button.Ripple>
        </Media>}
      </Media>
    </div>
  );
};

export default Index;
