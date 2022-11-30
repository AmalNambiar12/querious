import styles from "./DoubtPosting.module.css";
import {useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import UploadWidget from "./UploadWidget";

const DoubtPosting = () => {

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("roomInfo");
    nav("/")
  };

  const getToken = () => {
    let token = JSON.parse(localStorage.getItem("userInfo")).token;
    let tokenString = "Bearer " + token;
    let config = {
      headers: {
        "Content-type": "application/json",
        "Authorization": tokenString,
      }
    };
    return config;
  };

  const uploadDoubt = async (uID, rID, dTitle, dBody=null, dImglink=null,) => {
    let config = getToken();
    let d = new Date().toLocaleDateString();
    let t = new Date().toLocaleTimeString();
    config.method = "POST";
    config.body = JSON.stringify({
      userID: uID,
      roomID: rID,
      title: dTitle,
      date: d,
      time: t,
      body: dBody,
      imglink: dImglink,
      topic: dTopic,
      subtopic: dSubtopic
    });
    let url = "http://localhost:5000/api/doubts/";
    await fetch(url, config);
  }

  const postDoubt = async (e) => {
    e.preventDefault();
    const dTopic = document.querySelector("#topicInput").value;
    const dSubtopic = document.querySelector("#subtopicInput").value;
    const dTitle = document.querySelector("#titleInput").value;
    const dBody = document.querySelector("#descInput").value;
    const uID = JSON.parse(localStorage.getItem("userInfo")).id;
    const rID = parseInt(localStorage.getItem("roomInfo"));
    await uploadDoubt(uID, rID, dTitle, dBody, null, dTopic, dSubtopic);
    nav("/");
  }

  // const myWidget = cloudinary.createUploadWidget(
  //   {
  //     cloudName: "dli69lafd",
  //     uploadPreset: "querious"
  //   },
  //   (error, result) => {
  //     if (!error && result && result.event === "success") {
  //       console.log(result.info);
  //     }
  //   }
  // );

  // const openFileUpload = (e) => {
  //   e.preventDefault();
  //   console.log("HELLO")
  //   myWidget.open();
  // }

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      nav("/login");
  }})

  return (
    <div className={styles.doubtPostingDiv}>
      <div className={styles.navbarDiv}>
        <div className={styles.signatureDiv}>
          <img className={styles.logoIcon} alt="" src="../logo@2x.png" />
          <span className={styles.companyNameSpan}>Querious</span>
        </div>
        <span className={styles.currentRoomSpan}>Current Room</span>
        <div className={styles.navbarButtonsDiv}>
          {/* <button className={styles.onlineUsersButton}>
            <div className={styles.logoutDiv}>Online Users</div>
          </button> */}
          <button className={styles.onlineUsersButton} onClick={logout}>
            <div className={styles.logoutDiv}>Logout</div>
          </button>
          <button className={styles.menuButton}>
            <img className={styles.menuIcon} alt="" src="../menu.svg" />
          </button>
        </div>
      </div>
      <div className={styles.doubtPostingContents}>
        <form>
          <div className={styles.doubtPostDiv}>
            <div className={styles.topicBarDiv}>
              <span className={styles.topicValSpan}>{`Topic: `}</span>
              <input className={styles.topicFieldInput} type="text" id="topicInput" />
            </div>
            <div className={styles.subtopicBarDiv}>
              <div className={styles.topicValSpan}>Subtopic:</div>
              <input className={styles.topicFieldInput} type="text" id="subtopicInput" />
            </div>
            <div className={styles.titleBarDiv}>
              <div className={styles.topicValSpan}>Title:</div>
              <input className={styles.topicFieldInput} type="text" id="titleInput"required/>
            </div>
            <div className={styles.descriptionBoxDiv}>
              <div className={styles.topicValSpan} type="text" id="descInput">Description:</div>
              <textarea className={styles.topicFieldInput} />
            </div>
            <div className={styles.doubtPostButtonsDiv}>
              {/* <button className={styles.imageButton} onClick={openFileUpload}>
                <img className={styles.attach2Icon} alt="" src="../attach2.svg" />
                <div className={styles.imageDiv}>Image:</div>
                <UploadWidget />
              </button> */}
              <button className={styles.postButton} onClick={postDoubt}>
                <div className={styles.logoutDiv}>Post</div>
              </button>
            </div>
          </div>
        </form> 
      </div>
    </div>
  );
};

export default DoubtPosting;
