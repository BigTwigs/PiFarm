import React,{useState,useEffect,useContext} from 'react';
import {Container,Row,Col,Modal} from "react-bootstrap";
import SoilMoistureLogo from "../../images/Soil Moisture.png";
import {firestore} from "../../config/firebase";
import {AuthContext} from "../../config/Auth";

export default function SoilMoisture() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [moisture,setMoisture]=useState("");

    const {currentUser} = useContext(AuthContext);
    const uid=currentUser.uid;

    const moistureArray=[];
    // useEffect(()=>{
    //     firestore.collection("users").doc(uid).collection("systems").doc("flames").collection("moisture").onSnapshot(snapshot=>{
    //         //populate ph value array
    //         let changes = snapshot.docChanges();
    //         changes.forEach(change=>{
    //             if (change.type == "added") {//gets change type
    //                 moistureArray.push(change.doc.data().value);
    //             }
    //         });
    //         setMoisture(moistureArray[moistureArray.length-1]);


    //         //pull data in order of timestamp
    //         //push data in array in that order
    //         //get latest value and set ph to that value
    //         //render content in modal according to the value set
    //     });
    // },[]);

    useEffect(()=>{
        firestore.collection("users").doc(uid).collection("moisture").orderBy('timestamp','asc').onSnapshot(snapshot=>{
            let changes = snapshot.docChanges();
            changes.forEach(change=>{
                if(change.type==="added"){
                    moistureArray.push(change.doc.data().value);
                }
            });
            setMoisture(moistureArray[moistureArray.length - 1]);
            //pull data in order of timestamp
            //push data in array in that order
            //get latest value and set ph to that value
            //render content in modal according to the value set
        });
    },[]);

    const [suggestion,setSuggestion]=useState("");
    const suggestionArray={
        0:"The moisture level in your growing medium is too high. This can lead to root rot if left untreated. Refrain from deploying nutrients to your plants and allow the growing medium to filter excess moisture out of the system.",
        1:"Your moisture level is acceptable",
        2:"The growing medium has an extremely low moisture level. This can lead to stunted growth and high heat can burn your plants at this time. Nutrients should be deployed as soon as possible.",
        3: "The soil mositure level here refers to the moisture level of the growing medium in which your plants thrive in your hydroponic system.This measurement seeks to assist with deploying nutrients at the right time to your plants so that they remain neither underfed nor overfed.As a result, this measurements will give a good indication of when you should feed your plants during the course of the day."
    };

    const compareMoistureValues=()=>{
        let val=parseFloat(moisture);
            if(val>65)
                setSuggestion(suggestionArray[0]);
            else if(val>39 && val<=65)
                setSuggestion(suggestionArray[1])
            else if(val<=39)
                setSuggestion(suggestionArray[2]);
            else setSuggestion(suggestionArray[3]);
    }

    useEffect(()=>{
        compareMoistureValues();
    },[moisture]);

    return (
        <div className="colored-section" style={{paddingTop:"3.5%", paddingBottom:"3.5%"}}>
            <Container>
                <h1 className="section-heading">Soil Moisture Level</h1>
                <Row>
                    <Col md={4}>
                        <img style={{borderRadius:"50%",width:"100%",paddingTop:"2%"}} src={SoilMoistureLogo} alt="Soil Moisture Logo"></img>
                    </Col>
                    <Col md={8}>
                        <p>
                                The soil mositure level here refers to the moisture level of the growing medium in which your
                                plants thrive in your hydroponic system. This measurement seeks to assist with deploying nutrients at
                                the right time to your plants so that they remain neither underfed nor overfed. As a result, this 
                                measurement will give a good indication of when you should feed your plants during the course of the day.
                            </p>
                        <button className="btn btn-outline-dark" onClick={handleShow} type="button">More on Soil Moisture</button>
                        <h3 className="" style={{paddingTop:"4%",paddingBottom:"2%"}}>Current Soil Moisture Reading: {moisture}% saturated</h3>
                        
                        <p>{suggestion}</p>
                        {/* <button className="btn btn-dark">Check Soil Moisture Level</button> */}

                        
                        {/* <Pump moisturelevel={soilMoisture}/> */}
                    </Col>
                </Row>
            </Container>   

            <Modal contentLabel="Soil Moisture Reading Breakdown Modal" show={show} size="lg" onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Soil Moisture</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container fluid>
                            <h1>Soil Moisture in Hydroponics</h1>
                            <p>In hydroponics, soil moisture is only a concern with certain types of systems. Our major concern here though is the soil moisture level of a drip to waste system.
                            So why is soil moisture important? Soil moisture measures the degree of saturation of your growing media in your hydroponic system. This is important because a media that is
                            overly saturated can cause root rot in your plant roots and if the media is too dry, the plant can burn from heat or become stunted.</p>
                            <p>Soil moisture is becoming more of a concern especially in the hotter climates primarily because of climate change and by extension, global warming. Increasingly, 
                            it becomes an issue for the hydroponic farmer to leave their system during the day if they do not own a shade house that covers the system because of the heat, especially during the dry season.</p>
                            <p>Maintaining your system with an adequate level of moisture in your system can mean the difference between losing your cycle of plants or seeing them live till yield. However, it is important that you not overly deploy and dampen the growing media with nutrients or water specifically because it may end up doing more harm than good. In addition to root rot, your plant can also suffer from nutrient burn if the growing media is too damp. Therefore, you should deploy nutrients as needed but not in excess. </p>
                        </Container>
                    </Modal.Body> 
            </Modal>    
        </div>
    )
}
