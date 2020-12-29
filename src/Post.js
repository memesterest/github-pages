import React, { useEffect, useState, Component } from 'react';
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from "firebase";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 300,
      height: 300,
      backgroundColor: theme.palette.background.transparent,
      padding: theme.spacing(2, 4, 3),
    },
  }));

function Post({ color, postId, user, imageUrl, username, caption, profilePic, timestamp }) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [like, setLike] = useState([]);
    const [usernameMatch, setUsernameMatch] = useState("")

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            });
        }

        if(postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("likes")
            .onSnapshot((snapshot) => {
                setLike(snapshot.docs.length)
            })
        }

        return () => {
            unsubscribe();
        }

        setUsernameMatch({username});
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setComment("");
    }

    const deletePost = (e) => {
        if(user) {
            if(user.displayName == username) {
                db.collection("posts").doc(postId).delete({

                })
            } else {
                alert("YOU DONT HAVE PERMISSIONS TO DELETE THIS IS POST")
            }
        } else {
            alert("YOU DONT HAVE PERMISSIONS TO DELETE THIS IS POST");
        }
    }

    const likePost = (e) => {
        if(user) {
            db.collection("posts").doc(postId).collection("likes").add({

            })
    
            setOpen(true);
        }
    }

    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(imageUrl);
        alert("Copied ImageUrl")
    }

    return (
        <div className="post">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <h3 style={{color: "white", textAlign: "center",fontWeight: "800", fontSize: "20px"}}>You liked the Post from {username}</h3>
                    <FavoriteIcon style={{padding: "50px", height: "200px", width: "200px", color: "red"}}/>
                </div>
            </Modal>
            <div className="post__header">
                <h3 style={{backgroundColor: `${color}`, padding: "4px", borderRadius: "5px"}}>{username}</h3>
                <img
                    className="app__headerImage"
                    src="https://cdn.discordapp.com/attachments/752570499359572065/787647562504994816/Logo_1.png"
                    alt=""
                ></img>
            </div>

            <img 
                className="post__image"
                src={imageUrl}
                alt={username}
                onDoubleClick={likePost}
            />
            <div className="post__infoRow">
                <div className="post__infoRow">
                    <FavoriteIcon 
                        className="post__like"
                        onClick={likePost}
                    />
                    <h3 className="post__likes">{like}</h3>
                </div>
                
                <div className="post__infoRow">
                    <FileCopyIcon 
                        className="post__save"
                        onClick={copyCodeToClipboard}
                    />
                    
                    <DeleteIcon 
                        className="post__like"
                        onClick={deletePost}
                    />
                </div>
                
            </div>
            
            <center><h3 className="post__captionTitle">CAPTION</h3></center>
            <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>

            <div className="post__comments">
                <center><h3>COMMENTS</h3></center>
                {comments.map((comment) => (
                    <p>
                        <strong className="post__comment__text">{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {
                user&& (
                    <form className="post__commentBox">
                        <input 
                            className="post__input"
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            disabled={!comment}
                            className="post__button"
                            type="submit"
                            onClick={postComment}
                        >
                            Post
                        </button>
                    </form>
                )
            }
        </div>
    )
}

export default Post
