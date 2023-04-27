import React from 'react';
import ReactQuill from 'react-quill';
import CustomToolbar from './CustomToolbar';

import styles from './styles.module.scss';


interface OnChangeHandler {
  (e: any): void;
}

type Props = {
  className?: any;
  value?: string;
  placeholder?: string;
  onChange?: OnChangeHandler;
};

const TextEditor: React.FC<Props> = ({ value, onChange, placeholder, className }) => {
  const refEditor: any = React.useRef();

  const modules = {
    toolbar: {
      container: `#toolbar_${className}`
    }
  };
  const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'header',
    'blockquote',
    'code-block',
    'indent',
    'list',
    'direction',
    'align',
    'link',
    // 'image',
    // 'video',
    'formula'
  ];

  return (
    <>
      <CustomToolbar className={className} />
      <ReactQuill
        value={value}
        ref={refEditor}
        className={styles.textEditor}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </>
  );
};

export default TextEditor;
