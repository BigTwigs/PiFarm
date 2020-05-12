import React,{useState,useContext} from "react";
import app from "../../config/firebase";
import {css} from "emotion";
import {Link, Redirect} from "react-router-dom";
import {AuthContext} from "../../config/Auth";

const Login = () => {
    const [details,setDetails]=useState({
        email:"",
        password:""
    });

    function handleChange(event){
        const {name,value} = event.target;
        setDetails(prevValue => {
        return {
          ...prevValue,
          [name]: value
        };
      });
    }

    // function handleSubmit(e){
    //     e.preventDefault();
    //     console.log(details.email,details.password);
    //     auth.signInWithEmailAndPassword(details.email,details.password).then(response=>{
    //         console.log(response);
    //     });
    // }
    const handleSubmit=(
      async event=>{
        event.preventDefault();
        try{
          await app.auth().signInWithEmailAndPassword(details.email,details.password);
        } catch(error){
          alert(error);
        }
      }
    );

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
    

    return ( 
    <div className="colored-section" style={{paddingTop: "7%", paddingBottom: "7%"}}>  
      <h1 className="section-heading" style={{paddingBottom:"2%"}}>Login Page</h1>
      <div className="container" >
        <h4>Welcome back {details.email}!</h4>
        <form onSubmit={handleSubmit} className={css`
                    padding-top:3.5%;
                    padding-bottom:3.5%;
        `}>
              <input  className={css`
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
                value={details.email}
                onChange={handleChange}
              />
              <input  className={css`
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
                value={details.password}
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
                    `}>Login</button>
            </form>
            <div className={css`
                    a{
                        padding:1%;
                        margin:20px;
                    }
                `}>
                    <Link to="/PiFarm" className="btn btn-dark">Go to Home Page</Link>
                    <Link to="/Register" className="btn btn-dark">Go to Register Page</Link>
                </div>
      </div>
    </div>
    );
}

export default Login;