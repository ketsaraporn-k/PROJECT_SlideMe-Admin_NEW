import { Router } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { addNewUser, getUserByUsername, getUserWithRoleById, getAllUsers } from "../controllers/usercontrollers.js";

const usersRouter = Router();
const JWT_SECRET = "secret"

//post[/users]/register
usersRouter.post("/register", async(req, res) => {

    //retrieve data 
    const {username, password, role_id} = req.body
    /* console.log(username, password, role_id) */

    //validate data
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        const result = await addNewUser({username, password: hashedPassword, role_id})
        if (result === "success") {
            return res.status(200).json({message: "success"})
        }
        else {
            return res.status(400).json({message: "failed"})
        }
    }catch (error) {
        console.log(error)
        return res.status(400).json({message: "failed"})
    }
   
    })

//post[/users]/login
usersRouter.post("/login", async(req, res) => {
    const {username, password} = req.body
    try {
        const result = await getUserByUsername({username})
        console.log(result)
        if (result.length === 0) {
            console.log("Login failed: User not found");
            return res.status(404).json({message: "Not Found"})
        }

        //compare password with hashed password(from table)
        const matched = await bcrypt.compare(password, result[0].password)
        //console.log(matched)
        if (!matched) {
            console.log("Login failed: Incorrect password");
            return res.status(404).json({message: "Not Found"})
        }
        //generate token
        const token =  jwt.sign({id: result[0].id}, JWT_SECRET, {expiresIn: "1h"})
        
        return res.status(200).json({message: "OK", token})

    }catch(error) {
        console.log("Login failed due to error: " + error.message);
        return res.status(500).json({message: "failed"})
    }
    
   
    })


//middlewares capture beare token convert back to user id
/* const jwtTokenMiddleware = async(req, res, next) => {
    //extract token 
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload.id;
        next();
      } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
      }

} */
                                                                            //new
const jwtTokenMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // เช็คว่า header มีค่าถูกต้องไหม
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};


//get[/users]/verify
usersRouter.get("/verify",jwtTokenMiddleware, async(req, res) => {
    try {
        const result = await getUserWithRoleById({id: req.user})
        //console.log(result)
        if (result.length === 0) {
            return res.status(404).json({message: "Not Found"})
        }
        const user = result[0]
        return res.status(200).json({message: "OK", role: user.role})

    } catch (error) {
        console.log(error)
        return res.status(409).json({message: "Confilct"})
    }
})



// GET /users/list
usersRouter.get('/list', jwtTokenMiddleware, async (req, res) => {
    try {
      const user = await getUserWithRoleById({ id: req.user });
      
  
      if (user[0].role == "worker") {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      const users = await getAllUsers({ role: user[0].role });
      
      return res.status(200).json({ message: 'success', users });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

export default usersRouter

    
