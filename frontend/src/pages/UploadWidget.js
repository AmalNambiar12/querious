import {useEffect, useRef} from 'react';

const UploadWidget = () => {
    const cRef = useRef();
    const wRef = useRef();

    useEffect(() => {
        cRef.current = window.cloudinary;
        wRef.current = cRef.current.createUploadWidget({
            cloudName: "dli69lafd",
            uploadPreset: "querious"
        }, function(error, result) {
            console.log(result);
        });
    }, []);

    return (
        <button onClick={() => wRef.current.open()}>
            UPLOAD!
        </button>
    )
}

export default UploadWidget;