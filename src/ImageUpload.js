import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState("");
    const [color, setColor] = useState("");
    const [likes, setLikes] = useState(0);

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = (e) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                        color: color,
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    setColor("");
                })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />

            <input 
                className="imageupload__caption"
                type="text" 
                placeholder="Enter a caption.." 
                onChange={event => setCaption(event.target.value)} 
                value={caption} 
            />
            
            <div className="imageupload__main">
                <input 
                    type="file" 
                    onChange={handleChange} 
                />
            </div>

            <div className="imageupload__usernameColor">
                <h3>Username color</h3>
                <input 
                    type="color"
                    value={color}
                    onChange={event => setColor(event.target.value)}
                />
            </div>
            
            <Button 
                className="imageupload__button"
                onClick={handleUpload}
            >
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload