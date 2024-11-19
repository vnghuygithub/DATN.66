import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor({ value,onChange,isView }: any) {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
        }
    };

    return (
        <>
            <Editor
                // apiKey='6yeynrhquj16qie2zenk4vj501iue5sbhldqpvo9919xsquz'
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.2.0/tinymce.min.js"
                disabled={isView}
                value={value}
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