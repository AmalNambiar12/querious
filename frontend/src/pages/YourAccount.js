
import styles from "./YourAccount.module.css";
import {useState, useEffect} from 'react';

const YourAccount = () => {
  const [doubts, setDoubts] = useState([]);

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

  const switchRoom = async (userID) => {
    let config = getToken();
    let url = "http://localhost:5000/api/yourdoubts/"+userID;
    let x = await fetch(url, config).then(res => res.json());
    await setDoubts([]);
    for (let i=0; i<x.length; i++) {
      setDoubts(doubts => doubts.concat(x[i]));
    }
  };

  useEffect(() => {
    let x = localStorage.getItem("userInfo");
    if (!x) {
      nav("/login");
    }
    else {
      switchRoom(JSON.parse(x).id);
      console.log("hello");
    }
  }, []);

  return (
    <div className={styles.yourAccountDiv}>
      <div className={styles.navbarDiv}>
        <div className={styles.signatureDiv}>
          <img className={styles.logoIcon} alt="" src="../logo@2x.png" />
          <span className={styles.companyNameSpan}>Querious</span>
        </div>
        <span className={styles.currentRoomSpan}>Your Account</span>
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
      <div className={styles.yourAccountContentsDiv}>
        <div className={styles.leftSidebarDiv}>
          <div className={styles.profileDiv}>
            <div className={styles.userNameDiv}>User Name</div>
            {/* <div className={styles.unreadSolutions0}>Unread solutions: (0)</div> */}
            <button className={styles.profileButton}>
              <div className={styles.profileDiv1}>Profile</div>
            </button>
          </div>
          <div className={styles.roomsListDiv}>
            <div className={styles.roomsDiv}>Rooms</div>
          </div>
        </div>
        <div className={styles.rightSidebarDiv}>
          {/* <div className={styles.accountButtonBarDiv}>
            <div className={styles.yourDoubtsDiv}>
              <div className={styles.yourDoubtsDiv1}>Your Doubts</div>
            </div>
            <div className={styles.starredDoubtsDiv}>
              <div className={styles.starredDoubtsDiv1}>Starred Doubts</div>
            </div>
          </div> */}
          <div className={styles.yourDoubtsBanner}>
              Your Doubts
          </div>
          <div className={styles.accountDoubtListDiv}>
            <div className={styles.doubtDiv}>
              <div className={styles.headerDiv}>
                <div className={styles.senderNameDiv}>Sender Name</div>
                <div className={styles.timestampDiv}>Date, Time</div>
              </div>
              <b className={styles.titleB}>
                This is just a sample doubt with some main question. I just
                wanted the question in two lines.
              </b>
              <span className={styles.bodySpan}>
                <p className={styles.thisIsSome}>
                  This is some random text which will serve as the place holder
                  for the question description. Forgive my rambling but I have
                  to do this in order to occupy some space in the question
                  bubble.
                </p>
                <p className={styles.nowLetUs}>
                  Now, let us see how this can be made responsive.
                </p>
              </span>
              <div className={styles.buttonBarDiv}>
                <button className={styles.starButton}>
                  <img className={styles.starIcon} alt="" src="../star.svg" />
                </button>
                <button className={styles.solutionsButton}>
                  <div className={styles.solutionsDiv}>Solutions</div>
                </button>
              </div>
            </div>
            {doubts.map((item) => (
              <div className={styles.doubtDiv} key={item.doubtID}>
              <div className={styles.headerDiv}>
                {/* <div className={styles.senderNameDiv}>{item.username}</div> */}
                <div className={styles.timestampDiv}>{item.time}, {item.date}</div>
              </div>
              <b className={styles.titleB}>
                {item.title}
              </b>
              <span className={styles.bodySpan}>
                {item.body}
              </span>
              <div className={styles.buttonBarDiv}>
                <button className={styles.starButton}>
                  <img className={styles.starIcon} alt="" src="../star.svg" />
                </button>
                <button className={styles.solutionsButton}>
                  <div className={styles.solutionsDiv}>Solutions</div>
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourAccount;
