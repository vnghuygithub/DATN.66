import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TextEditorV2({ value,onChange,isView}: any) {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
        }
    };
    return (
        <>
            <Editor
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.2.0/tinymce.min.js"
                value={value}
                disabled={isView}
                onEditorChange={onChange}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    paste_data_images: false,
                }}
            />
        </>
    );
}