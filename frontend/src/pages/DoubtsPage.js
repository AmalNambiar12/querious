import styles from "./DoubtsPage.module.css";
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const DoubtsPage = () => {
  var room = 1;
  const [rooms, setRooms] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const nav = useNavigate();

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

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("roomInfo");
    nav("/")
  };
  
  const goToDoubtPage = () => {
    nav("/newdoubt");
  };
  
  const displayProfile = () => {}; // Gets all the profile info displayed

  const displayRooms = async () => {
    let config = getToken();
    let url = "http://localhost:5000/api/rooms/";
    let x = await fetch(url, config).then(res => res.json());
    await setRooms([]);
    for (let i=0; i<x.length; i++) {
      setRooms(rooms => rooms.concat(x[i]));
    }
    console.log(rooms);
  }; 

  const displayRightSideBar = () => {};

  const addDoubt = (doubtobj) => { 
  }; 

  const loadDoubt = () => {
    // Takes a number x and loads x more doubts

  }; 
  
  const refreshDoubts = () => {}; // to be triggered when a WebSockets request is loaded
  
  // "proxy": "http://localhost:5000",

  const switchRoom = async (roomID) => {
    let config = getToken();
    let url = "http://localhost:5000/api/doubts/"+roomID;
    let x = await fetch(url, config).then(res => res.json());
    await setDoubts([]);
    for (let i=0; i<x.length; i++) {
      setDoubts(doubts => doubts.concat(x[i]));
    }
    room = roomID
    localStorage.setItem("roomInfo", roomID.toString());
  };

  const search = async () => {
    const search = document.querySelector("#searchBar").value;
    let config = getToken();
    config.body = JSON.stringify({"search": search});
    config.method = "POST";
    let url = "http://localhost:5000/api/doubtsearch/"+room;
    let x = await fetch(url, config).then(res => res.json());
    await setDoubts([]);
    for (let i=0; i<x.length; i++) {
      setDoubts(doubts => doubts.concat(x[i]));
    }
  }

  const getFilteredDoubts = async (username, topic=null, subtopic=null) => {
    let config = getToken();
    config.body = JSON.stringify({"username": username, "topic": topic, "subtopic": subtopic});
    config.method = "POST";
    let url = "http://localhost:5000/api/doubtfilter/"+room;
    let x = await fetch(url, config).then(res => res.json());
    await setDoubts([]);
    for (let i=0; i<x.length; i++) {
      setDoubts(doubts => doubts.concat(x[i]));
    }
  }

  const filter = async () => {
    let username = document.querySelector("#usernameInput").value;
    let topic = document.querySelector("#topicInput").value;
    let subtopic = document.querySelector("#subtopicInput").value;
    if (username == "") username = null;
    if (topic == "") topic = null;
    if (subtopic == "") subtopic = null;
    getFilteredDoubts(username, topic, subtopic);
  }

  const postDoubt = async (uID, rID, dTitle, dBody=null, dImglink=null,) => {
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
      imglink: dImglink
    });
    let url = "http://localhost:5000/api/doubts/";
    await fetch(url, config);
  }
  
  const test = () => {
    getFilteredDoubts("Amal100");
  };

  const start = async () => {
    await displayRooms();
    switchRoom(1);
  }

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      nav("/login");
    }
    //postDoubt(1, 1, "Math", "Math Shit");
    //postDoubt(2, 1, "Math with Aryan", "Math Shit");
    displayRooms()
    switchRoom(1);
  }, []);
  
  return (
    <div className={styles.doubtsPageDiv}>
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
      <div className={styles.doubtPageBodyDiv}>
        <div className={styles.doubtPageContentsDiv}>
          <div className={styles.leftSidebarDiv}>
            <div className={styles.profileDiv}>
              <div className={styles.userNameDiv}>User Name</div>
              {/* <div className={styles.unreadSolutions0}>
                Unread solutions: (0)
              </div> */}
              <button className={styles.profileButton}>
                <div className={styles.logoutDiv}>Profile</div>
              </button>
            </div>
            <div className={styles.roomsListDiv}>
              <div className={styles.roomsDiv}>Rooms</div>
              <div className={styles.roomsListItemsDiv}>
                {rooms.map((item) => (
                  <div className={styles.roomsListItemDiv} key={item.roomID} onClick={() => switchRoom(item.roomID)}>
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.centreBarDiv}>
            <div className={styles.searchToolDiv}>
              <input
                className={styles.searchBarInput}
                type="text"
                placeholder="Search Doubt..."
                id="searchBar"
              />
              <div className={styles.searchButtonDiv} onClick={search}>
                <img className={styles.searchIcon} alt="" src="../search.svg" />
              </div>
            </div>
            <div className={styles.doubtList}>
              {/* <div className={styles.doubtDiv}>
                <div className={styles.headerDiv}>
                  <div className={styles.senderNameDiv}>Sender Name</div>
                  <div className={styles.timestampDiv}>Date, Time</div>
                </div>
                <b className={styles.doubtTitleB}>
                  This is just a sample doubt with some main question. I just
                  wanted the question in two lines.
                </b>
                <div className={styles.doubtBodyDiv}>
                  <p className={styles.doubtBodyText}>
                    This is some random text which will serve as the place holder
                    for the question description. Forgive my rambling but I have
                    to do this in order to occupy some space in the question
                    bubble.
                    Now, let us see how this can be made responsive.
                  </p>
                </div>
                <div className={styles.buttonBarDiv}>
                  <button className={styles.starButton}>
                    <img className={styles.starIcon} alt="" src="../star.svg" />
                  </button>
                  <button className={styles.solutionsButton}>
                    <div className={styles.solutionsDiv}>Solutions</div>
                  </button>
                </div>
              </div> */}
              {doubts.map((item) => (
                <div className={styles.doubtDiv} key={item.doubtID}>
                  <div className={styles.headerDiv}>
                    <div className={styles.senderNameDiv}>{item.username}</div>
                    <div className={styles.timestampDiv}>{item.time}, {item.date}</div>
                  </div>
                  <b className={styles.doubtTitleB}>
                    {item.title}
                  </b>
                  <div className={styles.doubtBodyDiv}>
                    <p className={styles.doubtBodyText}>
                      {item.body}
                    </p>
                  </div>
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
            <div className={styles.frameDiv}>
              {/* <div className={styles.userNameDiv}>
                hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
              </div> */}
            </div>
          </div>
          <div className={styles.rightSidebarDiv}>
            <div className={styles.filtersDiv}>
              <div className={styles.filtersDiv1}>Filters</div>
              <div>
              <input
                className={styles.searchBarInput}
                type="text"
                placeholder="Filter by sender"
                id="usernameInput"
              />
              </div>
              <div>
              <input
                className={styles.searchBarInput}
                type="text"
                placeholder="Filter by topic"
                id="topicInput"
              />
              </div>
              <div>
              <input
                className={styles.searchBarInput}
                type="text"
                placeholder="Filter by subtopic"
                id="subtopicInput"
              />
              </div>
              <button className={styles.filterButton}>
                <div className={styles.logoutDiv} onClick={filter}>Filter</div>
              </button>
            </div>
            <button className={styles.askDoubtButton}>
              <div className={styles.logoutDiv} onClick={goToDoubtPage}>Ask Doubt</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtsPage;
