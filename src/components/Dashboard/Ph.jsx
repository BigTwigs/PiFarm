import React,{useState,useEffect,useContext} from 'react';
//import phLogo from "../../images/ph.png";
import phScaleLogo from "../../images/phScale.png";
import {Container,Row,Col,Modal} from "react-bootstrap";
import {firestore} from "../../config/firebase";
import {AuthContext} from "../../config/Auth";

export default function Ph() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [ph,setpH]=useState("");

    const {currentUser} = useContext(AuthContext);
    const uid=currentUser.uid;

     const phArray=[];
    // useEffect(()=>{
    //     firestore.collection("users").doc(uid).collection("systems").doc("flames").collection("ph").onSnapshot(snapshot=>{
    //         //populate ph value array
    //         let changes = snapshot.docChanges();
    //         changes.forEach(change=>{
    //             if (change.type == "added") {//gets change type
    //                 phArray.push(change.doc.data().value);
    //             }
    //         });
    //         setpH(phArray[phArray.length-1]);


    //         //pull data in order of timestamp
    //         //push data in array in that order
    //         //get latest value and set ph to that value
    //         //render content in modal according to the value set
    //     });
    // },[]);

    useEffect(()=>{
        firestore.collection("users").doc(uid).collection("ph").orderBy('timestamp','asc').onSnapshot(snapshot=>{
            let changes=snapshot.docChanges();
            changes.forEach(change=>{
                if(change.type==="added"){
                    phArray.push(change.doc.data().value);
                }
            });
            setpH(phArray[phArray.length - 1]);


            //pull data in order of timestamp
            //push data in array in that order
            //get latest value and set ph to that value
            //render content in modal according to the value set
        });
    },[]);

    const [suggestion,setSuggestion]=useState("");
    const suggestionArray={
        0:"The pH of your nutrient solution is too acidic. Apply pH-Up solution to your nutrient solution immediately to prevent wastage of nutrients when deployed to your plants.",
        1:"The pH of your nutrient solution is too basic. Apply pH-Down solution to your nutrient solution immediately to prevent trace elements from being wasted during nutrient deployment.",
        2:"The pH of your nutrient solution is acceptable.",
        3:""
    };

    const comparepHValues=()=>{
        let val=parseFloat(ph);
            if(val<6.0)
                setSuggestion(suggestionArray[0]);
            else if(val>5.9 && val<7.0)
                setSuggestion(suggestionArray[2])
            else if(val>=7.0)
                setSuggestion(suggestionArray[1]);
            else setSuggestion(suggestionArray[3]);
    }

    useEffect(()=>{
        comparepHValues();
    },[ph]);
    
    return (
        <div className="colored-section"
        style = {
            {
                paddingTop: '3.5%',
                paddingBottom:"3.5%"
            }
        } >
        <Container>
        <h1 className="section-heading ">PH Level</h1>
            <Row>
            <Col md={4} >
                <img src={phScaleLogo} style={{width:'100%',borderRadius: '50%',paddingTop:"2%" }} alt="logo" />
            </Col>
            <Col md={8} >
                <p>The pH level is measured on a scale from 1 to 14, with the neutral point being 7. Everything above neutral is alkaline and everything below is acidic. In hydroponics,
                    when growing several different types of herbs or vegetables in one container, you will probably do best in the range of 5.6 to 6.5, because it is within this range that nutrients
                    are most available to plants.</p>
                <p>For instance, at 7.0, which is outside the most suitable range for vegetables, plants are still capable of taking up such elements as nitrogen, phosphorous and potassium.
                   At this level though, the trace elements are becoming lost to the plants; the amounts of iron, maganese, boron, copper, zinc and molybdenum are generally cut in half.
                   So if your pH is above 7, be on the lookout for trace element problems rather than those caused by macronutrients nitrogen, phosphorous and potassium.</p>
                <button className="btn btn-outline-dark" onClick={handleShow} type="button">More on pH values</button>
                <h3 className="" style={{paddingTop:"4%",paddingBottom:"2%"}}>Current PH Reading: {ph}</h3>
                <p>{suggestion}</p>
                {/* <button className="btn btn-dark">Check Ph level</button> */}

                
                
            </Col> 
        </Row>
        </Container>
            
            <Modal show={show} size="lg" onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>pH Breakdown</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container fluid>
                            <h1>What you need to know about pH in hydroponics</h1>
                            <p>
                                 The term "pH" stands for "potential hydrogen" because hydrogen ions (H+) and hydroxide ions (OH-) are what cause a solution to be basic or acidic. 
                                 pH tests measure the concentration of these two substancs on a scale from 1 to 14 indicating how acidic a solution is or how basic it is accordingly.
                            </p>
                            <p>
                                It is important to understand how basic or acidic your solution is because it tells you about nutrient availability, the hardness of your source water, and it can help you identify deficiencies. 
                                For the most part, nutrients are most available between a pH range of 5.5 to 6.5. Beyong this range, trace elements become lost to your plants even if they are present in your nutrient solution.
                            </p>
                            <p>
                                Take iron for example. It comes in two forms - ferric and ferrous. Ferric has a charge of +3 and is unavailable to plants. Ferrous iron, on the other hand, has a charge of +2 and is available to plants. Iron fluctuates between these two forms in your system. As it is, ferrous iron can quickly become ferrir iron in a system with a high pH because of the way it reacts with hydrogen ions. Therefore, in higher pH symptoms, plants can more quickly develop iron deficiencies.
                            </p>
                        </Container>
                        
                    </Modal.Body> 
                    
                </Modal> 
        </div>
        
    )
}
