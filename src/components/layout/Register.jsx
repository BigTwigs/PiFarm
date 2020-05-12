import React,{useState,useContext} from 'react';
import {Link,Redirect} from "react-router-dom";
import {css} from "emotion";
import app from "../../config/firebase";
import {AuthContext} from "../../config/Auth";

const Register = () => {
    const[data,setData]=useState({
        name:"",
        email:"",
        password:"",
        confirmpassword:""
    });

    function handleChange(event){
      const {name,value} = event.target;
      setData(prevValue => {
        return {
          ...prevValue,
          [name]: value
        };
      });
  }

  const handleSubmit=(async event=>{
    event.preventDefault();
    try{
        app.auth().createUserWithEmailAndPassword(data.email,data.password).then(cred=>{ //creating account
            //creating a section of the database for the user
            return app.firestore().collection('users').doc(cred.user.uid).set({
                name:data.name,
                email:data.email
            });
        });
    } catch(error){
        console.log(error.message);
        alert(error.message);
    }
  });

  const {currentUser} = useContext(AuthContext);

    if(currentUser){
        if (currentUser.uid!=null){
            //recording user ID that is currently logged into the app in a firebase collection
            const uid = currentUser.uid;
            console.log(uid)  
            app.firestore().collection('current user').add({
                userid: uid,
                timestamp: app.firestore.FieldValue.serverTimestamp()
            }).catch(function(error) {
                console.error(error);
            }); 
        }
        return (<><Redirect to="/Dashboard" /></>);
    }
    

//   {
//       event.preventDefault();
//       console.log("button submitted");
    //   if(!log){ const result = comparePasswords(accountInfo.password,checkPassword);
    //     if(result!==0){
    //         alert("Your passwords do not match");
    //     }
    //     else{
    //         //create account for new user
    //         createUser(accountInfo.email,accountInfo.password);
    //         resetState();     
    //     }
    // }
    //   else{
    //       //perform authentication and log user in
    //         loggedIn();
    //   }
      
  //}
    return (
        <div className="colored-section" style={{paddingTop:"7%",paddingBottom:"7%"}}>
            <h1 className="section-heading" style={{paddingBottom:"2%"}}>Signup Page</h1>
            <div className="container">
                <h5>Hello {data.name}</h5>
                <p>{data.email}</p>
                <form onSubmit={handleSubmit} className={css`
                    padding-top:3.5%;
                    padding-bottom:3.5%;

                `}>
                    <input className={css`
                        border: 1px solid black;
                        background-color: rgba(252, 252, 252, 0.2);
                        width: 250px;
                        border-radius: 3px;
                        padding: 10px 15px;
                        margin: 0 auto 10px auto;
                        display: block;
                        text-align: center;
                        font-size: 18px;
                        color: black;
                        font-weight: 300;
                    `}
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={data.fname}
                        onChange={handleChange}
                    />
                    <input className={css`
                        border: 1px solid black;
                        background-color: rgba(252, 252, 252, 0.2);
                        width: 250px;
                        border-radius: 3px;
                        padding: 10px 15px;
                        margin: 0 auto 10px auto;
                        display: block;
                        text-align: center;
                        font-size: 18px;
                        color: black;
                        font-weight: 300;
                    `}
                        name="email"
                        type="text"
                        placeholder="Email"
                        value={data.email}
                        onChange={handleChange}
                    />
                    <input className={css`
                        border: 1px solid black;
                        background-color: rgba(252, 252, 252, 0.2);
                        width: 250px;
                        border-radius: 3px;
                        padding: 10px 15px;
                        margin: 0 auto 10px auto;
                        display: block;
                        text-align: center;
                        font-size: 18px;
                        color: black;
                        font-weight: 300;
                    `}
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={handleChange}
                    />
                    <input className={css`
                        border: 1px solid black;
                        background-color: rgba(252, 252, 252, 0.2);
                        width: 250px;
                        border-radius: 3px;
                        padding: 10px 15px;
                        margin: 0 auto 10px auto;
                        display: block;
                        text-align: center;
                        font-size: 18px;
                        color: black;
                        font-weight: 300;
                    `}
                        name="confirmpassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={data.confirmpassword}
                        onChange={handleChange}
                    />
                    <button type="submit" className={css`
                        appearance: none;
                        outline: 0;
                        background-color: white;
                        border: 0;
                        padding: 10px 15px;
                        color: black;
                        border-radius: 3px;
                        width: 250px;
                        font-size: 18px;
                    `}>Create Account</button>
                </form>

                <div className={css`
                    a{
                        padding:1%;
                        margin:20px;
                    }
                `}>
                    <Link to="/PiFarm" className="btn btn-dark">Go to Home Page</Link>
                    <Link to="/Login" className="btn btn-dark">Go to Login Page</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;