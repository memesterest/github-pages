import React, { useEffect, useState } from "react";
import './App.css';
import Post from "./Post";
import { auth, db } from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import ImageUpload from "./ImageUpload";
import Widget from "./Widget";

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
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openPost, setOpenPost] = useState(false)
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})));
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://cdn.discordapp.com/attachments/752570499359572065/787648021830696980/Logo2.png"
                alt=""
              ></img>
            </center>

              <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />   

              <Input 
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />     

              <Button type="submit" onClick={signUp}>Register</Button>    
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://cdn.discordapp.com/attachments/752570499359572065/787648021830696980/Logo2.png"
                alt=""
              ></img>
            </center>

            <Input 
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />     

            <Button type="submit" onClick={signIn}>Login</Button>    
          </form>
        </div>
      </Modal>

      <Modal
        open={openPost}
        onClose={() => setOpenPost(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName ? (
            <ImageUpload className="imageupload" username={user.displayName} imagePic={user.profilePic} />
          ): (
            <center><h3 style={{fontWeight: "800"}}>LOGIN TO UPLOAD</h3></center>
          )}
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://cdn.discordapp.com/attachments/752570499359572065/787647562504994816/Logo_1.png"
          alt=""
        ></img>

        {user ? (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenPost(true)}>POST</Button>
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div> 
      

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post 
                color={post.color}
                user={user}
                postId={id}
                key={id}
                username={post.username}
                imageUrl={post.imageUrl}
                caption={post.caption}
                profilePic={post.profilePic}
                timestamp={post.timestamp}
              />
            ))
          }
        </div>

        <div className="app__postsRight">
          
        </div>
      </div>
    </div>
  );
}

export default App;