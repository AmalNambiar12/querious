import styles from "./SolutionPage.module.css";
import {useState, useEffect} from 'react';

const SolutionPage = () => {
  let doubt = 1;
  const [solutions, setSolutions] = useState([]);

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

  const uploadSolution = async (uID, dID, sBody=null, sImglink=null,) => {
    let config = getToken();
    let d = new Date().toLocaleDateString();
    let t = new Date().toLocaleTimeString();
    config.method = "POST";
    config.body = JSON.stringify({
      userID: uID,
      doubtID: dID,
      date: d,
      time: t,
      body: sBody,
      imglink: sImglink,
    });
    let url = "http://localhost:5000/api/doubts/";
    await fetch(url, config);
  }

  const postSolution = async (e) => {
    e.preventDefault();
    const sBody = document.querySelector("solutionInput").value;
    const uID = JSON.parse(localStorage.getItem("userInfo")).id;
    // const dID = parseInt(localStorage.getItem("roomInfo"));
    await uploadSolution(uID, doubt, sBody);
    nav("/");
  }


  const displaySolutions= async (doubtID) => {
    let config = getToken();
    let url = "http://localhost:5000/api/solutions/"+doubtID;
    let x = await fetch(url, config).then(res => res.json());
    await setSolutions([]);
    for (let i=0; i<x.length; i++) {
      setSolutions(solutions => solutions.concat(x[i]));
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      nav("/login");
    }
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("doubt")) {
      doubt = parseInt(urlParams.get("doubt"));
      console.log(doubt);
    }
    displaySolutions(doubt);
  }, []);
  
  return (
    <div className={styles.solutionPageDiv}>
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
            <img className={styles.menuIcon} alt="" src="../menu1.svg" />
          </button>
        </div>
      </div>
      <div className={styles.solutionPageBodyDiv}>
        <div className={styles.leftSideBarDiv}>
          <div className={styles.profileDiv}>
            <div className={styles.userNameDiv}>User Name</div>
            {/* <div className={styles.unreadSolutions0}>Unread solutions: (0)</div> */}
            <button className={styles.profileButton}>
              <div className={styles.logoutDiv}>Profile</div>
            </button>
          </div>
          <div className={styles.roomsListDiv}>
            <div className={styles.roomsDiv}>Rooms</div>
          </div>
        </div>
        <div className={styles.rightSidebarDiv}>
          <div className={styles.bubblesDiv}>
            {/* <div className={styles.mainDoubtDiv}>
              <span className={styles.senderNameSpan}>Sender Name</span>
              <b className={styles.mainDoubtTitleB}>
                This is just a sample doubt with some main question. I just
                wanted the question in two lines.
              </b>
              <span className={styles.bodySpan}>
                <p className={styles.mainDoubtBodyText}>
                  This is some random text which will serve as the place holder
                  for the question description. Forgive my rambling but I have
                  to do this in order to occupy some space in the question
                  bubble.
                </p>
              </span>
            </div>
            <div className={styles.solutionDiv}>
              <b className={styles.senderNameB}>Sender Name</b>
              <div className={styles.bodyDiv}>
                Just a random osdihxziuc hziu ghuiui yuiayiu iuzxciu giuzgxc
                uizgc uhcgjxcg zxgi uziuxhcuhczkxczi chzxihc
                uizhxkjhucxuzhuhuhxzjcixhzcuihux czuh uyhgxyucg ygzyxgc uhxiuczh
                iuiu zxhciu hzxuihcuihuiehfgaygsygygG ygeyfaiu iuzxh cuihxuch
                iuzh iocxoi cuziouoixu ciozuoiuxoo.
              </div>
              <button className={styles.bestSolutionButton}>
                <div className={styles.bestSolutionDiv}>Best Solution</div>
              </button>
            </div> */}
            {solutions.map((item) => (
              <div className={styles.solutionDiv}>
              <b className={styles.senderNameB}>{item.userID}</b>
              <div className={styles.bodyDiv}>
                {item.body}
              </div>
              <button className={styles.bestSolutionButton}>
                <div className={styles.bestSolutionDiv}>Best Solution</div>
              </button>
            </div>
            ))}
          </div>
          <div className={styles.solutionBoxDiv}>
            <input
              className={styles.solutionBarInput}
              type="text"
              placeholder="Post your solution .."
              id="solutionInput"
            />
            <div className={styles.solutionButtonBarDiv}>
              {/* <button className={styles.attachButton}>
                <img
                  className={styles.attach2Icon}
                  alt=""
                  src="../attach21.svg"
                />
              </button> */}
              <button className={styles.logoutButton1}>
                <div className={styles.logoutDiv} onClick={postSolution}>Send</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;
