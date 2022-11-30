const mariadb = require("mariadb");
const fs = require("fs");

let connection;

async function main() {
    const serverCert = fs.readFileSync("skysql_chain_2.pem", "utf8");

    try {
        connection = await mariadb.createConnection({
            host: "demo-server-db00008431.mdb0002418.db.skysql.net",
            port: 5004,
            ssl: { ca: serverCert },
            user: 	"DB00008431",
            password: "i9(VVFbMW(8Xv8MTtD072FoqeG",
        });

        // If this doesn't work with your DB, try using utf8mb4 instead:
        await connection.execute("SET NAMES utf8");

        // await addRoom("Physics", 2);
        // await addRoom("Chemistry", 3);
        // await postDoubt(10, 2, "Classical Mechanics", "How did Newton die?");
        // await postDoubt(11, 3, "Organic Chemistry", "THIS MAKES NO SENSE!");
        
        console.log("DONE!");
    } catch (err) {
        console.log(err);
    } finally {
        //if (connection) await connection.close();
    }
}

async function addUser(username, password, userID=null) {
    try {
        await connection.execute("USE demo_db;");
        await connection.execute(
            "INSERT INTO users (userID, username, password) VALUES (?, ?, ?);",
            [userID, username, password]
        );
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function returnUser(username) {
    try {
        if (userExists(username)) {
            await connection.execute("USE demo_db;");
            let out = await connection.execute(
                "SELECT userID, username FROM users WHERE username=?;",
                [username]
            );
            return out[0];
        } else {
            return {};
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function returnUserByID(userID) {
    try {
        if (userExistsByID(userID)) {
            await connection.execute("USE demo_db;");
            let out = await connection.execute(
                "SELECT userID, username FROM users WHERE userID=?;",
                [userID]
            );
            return out[0];
        } else {
            return {};
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function userExists(username) {
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT username FROM users WHERE username=?;",
            [username]
        );
        return out.length != 0;
    } catch (err) {
        console.log(err);
    }
}

async function userExistsByID(userID) {
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT username FROM users WHERE userID=?;",
            [userID]
        );
        return out.length != 0;
    } catch (err) {
        console.log(err);
    }
}

async function matchPassword(username, password) {
    try {
        if (userExists(username)) {
            let out = await connection.execute(
                "SELECT password FROM users WHERE username=?;",
                [username]
            );
            return out[0].password == password;
        }
    } catch (err) {
        console.log(err);
    } 

}

async function verifyUser(username, password) {
    // returns 0 if no error occurs
    // returns 1 if no such username exists
    // returns 2 if username exists but password does not
    try {
        await connection.execute("USE demo_db;");
        
        let out = await connection.query(
            "SELECT username, password FROM users WHERE username=?",
            [username]
        );

        if (out.length == 0) {
            return 1;
        }
        else {
            if (out[0].password == password) {
                return 0;
            }
            else {
                return 2;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function deleteUser(userID) {
    try {
        await connection.execute("USE demo_db;");
        await connection.execute(
            "UPDATE doubts SET userID=? WHERE userID=?;",
            [1, userID]
        );
        await connection.execute(
            "UPDATE solutions SET userID=? WHERE userID=?;",
            [1, userID]
        );
        await connection.execute(
            "DELETE FROM users WHERE userID=?;",
            [userID]
        );
    } catch (err) {
        console.log(err);
    }
}

async function postDoubt(userID, roomID, title, date, time, body=null, imglink=null, topic=null, subtopic=null) {
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT username FROM users WHERE userID=?;",
            [userID]
        );
        let username = out[0].username;
        await connection.execute(
            "INSERT INTO doubts (userID, username, title, body, imglink, roomID, date, time, topic, subtopic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [userID, username, title, body, imglink, roomID, date, time, topic, subtopic]
        );
    } catch (err) {
        console.log(err);
    }
}

async function getDoubts(roomID) {
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT doubtID, username, title, body, imglink, date, time FROM doubts where roomID=?;",
            [roomID]
        );
        return out;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function getDoubtsBySearch(roomID, search) {
    try {
        await connection.execute("USE demo_db;");
        let searchObj = '%'+search+'%';
        let out = await connection.execute(
            "SELECT doubtID, username, title, body, imglink, date, time FROM doubts WHERE roomID=? AND title LIKE ?;",
            [roomID, searchObj]
        );
        console.log(out);
        return out;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function getDoubtsByFilter(roomID, username=null, topic=null, subtopic=null) {
    try {
        await connection.execute("USE demo_db;");
        let searchObj = "";
        if (username != null) searchObj += " AND username='"+username+"'";
        if (topic != null) searchObj += " AND topic='"+topic+"'";
        if (subtopic != null) searchObj += " AND subtopic='"+subtopic+"'";
        let completeQuery = "SELECT doubtID, username, title, body, imglink, date, time FROM doubts WHERE roomID=?" + searchObj + ";";
        console.log(completeQuery);
        let out = await connection.execute(
            completeQuery,
            [roomID]
        );
        console.log(out);
        return out;
    } catch (err) {
        console.log(err);
        return [];
    }
}
async function getUserDoubts(userID) {
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT doubtID, username, title, body, imglink, date, time FROM doubts where userID=?;",
            [userID]
        );
        return out;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function postSolution(userID, doubtID, date, time, body=null, imglink=null) { 
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT username FROM users WHERE userID=?;",
            [userID]
        );
        let username = out[0].username;
        await connection.execute(
            "INSERT INTO doubts (userID, username, body, imglink, doubtID, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [userID, username, body, imglink, doubtID, date, time, topic, subtopic]
        );
    } catch (err) {
        console.log(err);
    }
}

async function getSolutions(doubtID) {
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT solutionID, doubtID, username, body, imglink, date, time FROM solutions where doubtID=?;",
            [doubtID]
        );
        return out;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function addRoom(title, roomID=null) {
    try {
        await connection.execute("USE demo_db;");
        await connection.execute(
            "INSERT INTO rooms (title, roomID) VALUES (?, ?);",
            [title, roomID]
        );
    } catch (err) {
        console.log(err);
    }
}

async function getRooms() {
    try {
        await connection.execute("USE demo_db;");
        let out = await connection.execute(
            "SELECT roomID, title FROM rooms;",
        );
        return out;
    } catch (err) {
        console.log(err);
    }
}

async function closeConnection() {
    if (connection) await connection.close();
}

async function cleanSlate() {
    try {
        await connection.execute("USE demo_db;");
        await connection.execute(
            "DELETE FROM solutions;",
        );
        await connection.execute(
            "DELETE FROM doubts;",
        );
        await connection.execute(
            "DELETE FROM users;",
        );
        await connection.execute(
            "DELETE FROM rooms;",
        );
    } catch (err) {
        console.log(err);
    }
}

main();
module.exports = {addUser, returnUser, userExists, returnUserByID, userExistsByID, verifyUser, deleteUser, 
    postDoubt, matchPassword, getDoubts, getDoubtsBySearch, getDoubtsByFilter, getUserDoubts, postSolution, getSolutions, addRoom, getRooms};

