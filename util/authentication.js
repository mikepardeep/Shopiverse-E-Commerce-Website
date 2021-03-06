//File to create and destroy user session

//create a user session
function createUserSession(req,user,action){

    //store a data to the session in database to indicates user
    req.session.uid = user._id.toString();

    //store the admin session from isAdmin
    req.session.isAdmin = user.isAdmin;

    //save the session
    req.session.save(action);
}

//destroy the user auth session
function destroyUserAuthSession(req){
    //set the session uid to null to revoke access
    req.session.uid = null;
}


module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
};