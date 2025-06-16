import jwt from "jsonwebtoken";

export const genToken = async (userId, jwt_secret) => {
    try{
        const token = await jwt.sign({id : userId}, jwt_secret, {expiresIn : "10d"});
        return token;
    }catch(error){
        console.log(error);
    }
}