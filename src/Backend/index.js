const { userDB, modelDB } = require("./DB");
const express = require("express")
const cors = require("cors")
const app = express()

const { v4: uuidv4 } = require('uuid');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userDB.findOne({ email: email, password: password });

        if (user) {
            console.log("User:", user);
            res.json({ status: "success", user: user });

        } else {
            res.json({ status: "failure" });
        }
    }
    catch (e) {
        res.json({ status: "error" });
    }
});

app.post("/signup", async (req, res) => {
    const { uname, email, password, role } = req.body

    const data = {
        usertokenid: uuidv4(),
        username: uname,
        email: email,
        password: password,
        role: role,
        profilepic: `https://www.gravatar.com/avatar/${uname}?d=identicon`
    }

    try {
        const check = await userDB.findOne({ email: email })
        const unamecheck = await userDB.findOne({ username: uname })


        if (unamecheck) {
            res.json("unameexist")
        }
        else if (check) {
            res.json("exist")
        }
        else {
            res.json("notexist")
            await userDB.insertMany([data])
        }

    }
    catch (e) {
        res.json("fail")
    }

})


app.post("/EditProfile", async (req, res) => {
    const { usertokenid, newPassword, newRole } = req.body;

    console.log("EditProfile Request Received:", req.body); // Log incoming data

    if (!usertokenid || !newPassword || !newRole) {
        return res.json({ status: "failure", message: "Missing fields" });
    }

    try {
        const updateResult = await userDB.updateOne(
            { usertokenid: usertokenid },
            { $set: { password: newPassword, role: newRole } }
        );

        console.log("Update Result:", updateResult); // Log update result

        if (updateResult.modifiedCount === 0) {
            return res.json({ status: "failure", message: "User not found or data unchanged" });
        }

        const updatedUser = await userDB.findOne({ usertokenid: usertokenid });
        delete updatedUser.password; // Remove password before sending response

        console.log("Updated User:", updatedUser); // Log updated user

        res.json({ status: "success", user: updatedUser });
    } catch (e) {
        console.error("Error updating profile:", e);
        res.json({ status: "error", message: e.message });
    }
});


app.post('/uploadmodel', async (req, res) => {
    try {
        const {
            modelName,
            modelDescription,
            modelModality,
            modelType,
            s3Url,
            username,
            modeltokenid
        } = req.body;

        const data = {
            modeltokenid: modeltokenid,
            modelname: modelName,
            modeldescription: modelDescription,
            modelmodality: modelModality,
            modeltype: modelType,
            s3_url: s3Url,
            username: username
        }
        console.log("Upload Model uploaded Completed:", data); // Log incoming data

        await modelDB.insertMany([data]);
        res.status(201).json({ message: 'Model information saved successfully' });
    } catch (error) {
        console.error('Error saving model information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getmodels/:username', async (req, res) => {
    try {
        const username = req.params.username;

        const models = await modelDB.find({ username: username });

        if (!models || models.length === 0) {
            return res.status(200).json({ message: 'No models found for the given usertokenid' });
        }

        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getallusers', async (req, res) => {
    try {
        const users = await userDB.find();

        if (!users || users.length === 0) {
            return res.status(200).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getallmodels', async (req, res) => {
    try {
        const models = await modelDB.find();

        if (!models || models.length === 0) {
            return res.status(200).json({ message: 'No models found' });
        }

        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getusername/:usertokenid', async (req, res) => {
    try {
        const usertokenid = req.params.usertokenid;

        const user = await userDB.findOne({ usertokenid: usertokenid });

        if (!user) {
            return res.status(200).json({ message: 'No user found for the given usertokenid' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getuserdetails/:username', async (req, res) => {
    try{
        const username = req.params.username;
        const user = await userDB.findOne({ username: username });

        if (!user) {
            return res.status(200).json({ message: 'No user found for the given usertokenid' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/getmodeldetails/:modeltokenid', async (req, res) => {
    try {
        const modeltokenid = req.params.modeltokenid;
        console.log("Request Received:", req.params);
        const model = await modelDB.findOne({ modeltokenid: modeltokenid });

        if (!model) {
            return res.status(200).json({ message: 'NotFound' });
        }

        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/Test", (req, res) => {
    res.send("Test Route");
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})