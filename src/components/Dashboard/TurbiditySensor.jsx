import React,{useState,useEffect,useContext} from 'react'
import {Container,Row,Col,Modal} from "react-bootstrap";
import TurbidityLogo from "../../images/Turbidity.png";
import {firestore} from "../../config/firebase";
import {AuthContext} from "../../config/Auth";


export default function TurbiditySensor() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [ppm,setPpm]=useState("");

    const {currentUser} = useContext(AuthContext);
    const uid=currentUser.uid;

    const ppmArray=[];
    // useEffect(()=>{
    //     firestore.collection("users").doc(uid).collection("systems").doc("flames").collection("ppm").onSnapshot(snapshot=>{
    //         //populate ph value array
    //         let changes = snapshot.docChanges();
    //         changes.forEach(change=>{
    //             if (change.type == "added") {//gets change type
    //                 ppmArray.push(change.doc.data().value);
    //             }
    //         });
    //         setPpm(ppmArray[ppmArray.length-1]);


            
    //     });
    // },[]);

    useEffect(()=>{
        firestore.collection("users").doc(uid).collection("ppm").orderBy('timestamp','asc').onSnapshot(snapshot=>{
            let changes = snapshot.docChanges();
            changes.forEach(change=>{
                if(change.type==="added"){
                    ppmArray.push(change.doc.data().value);
                }
            });
            setPpm(ppmArray[ppmArray.length - 1]);
            //pull data in order of timestamp
            //push data in array in that order
            //get latest value and set ph to that value
            //render content in modal according to the value set
        });
    });

    const [suggestion,setSuggestion]=useState("");
    const suggestionArray={
        0:"Your PPM level in the reservoir is too concentrated. This can lead to nurtient burn in your plants. Please add more water to dilute your reservoir's concentration.",
        1:"Your PPM level is too low. This can lead to stunted growth in your plants. Follow the instructions on your NPK mix and add the appropriate amount of NPK to your reservoir to raise your PPM value to the desired level.",
        2:"Your PPM level is acceptable ",
        3: "Turbidity is an optical determination of water clarity. It is determined by the amount  of light particles in the water column.The more particles that are present, the more light is refracted in the water column."
    };

    const comparepHValues=()=>{
        let val=parseFloat(ppm);
            if(val>=1600)
                setSuggestion(suggestionArray[0]);
            else if(val>=800 && val<1600)
                setSuggestion(suggestionArray[2])
            else if(val<800)
                setSuggestion(suggestionArray[1]);
            else setSuggestion(suggestionArray[3]);
    }

    useEffect(()=>{
        comparepHValues();
    },[ppm]);

    return (
        <div className="dark-section" style={{paddingTop:'3.5%',paddingBottom:'3.5%'}}>
        <Container>
        <h1 className="section-heading colored-text">PPM Level</h1> 
            <Row>
                <Col md={8}> 
                    <p className="white-text">Ppm or parts per million 
                        is used as a measurement of strength of the nutrient solution in a hydroponic reservoir,
                        indicating how many milligrams of nutrients are present in every 1 litre of water. The 
                        amount of nutrient needed depends on the growth stage and the type of plant grown in the hydroponic system.
                        This is important since a low level of ppm will result in your plants becoming stunted 
                        in growth since not enough nutrients are present, for instance.</p>
                    <button className = "btn btn-warning"
                    style = {
                        {
                            backgroundColor: '#ffd31d'
                        }
                    }
                    onClick = {
                        handleShow
                    } type="button">More on PPM</button>
                      
                    <h3 className="colored-text" style={{paddingTop:"4%",paddingBottom:"2%"}}>Current PPM Reading: {ppm} ppm</h3>
                       
                    <p className = "white-text" >
                        {suggestion}
                    </p>

                    {/* <button className="btn btn-warning" style={{backgroundColor:'#ffd31d'}}>Check PPM Level</button> */}

                    
                                
                    
                </Col>
                <Col md={4} >
                    <img style={{width:'100%',borderRadius: '50%',paddingTop:"2%" }} src={TurbidityLogo} alt="Turbidity Logo"/>
                </Col>
            </Row>
        </Container>
            
            <Modal contentLabel="PPM Reading Breakdown Modal" show={show} size="lg" onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>PPM Breakdown</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container fluid>
                        <h1>PPM in hydroponics</h1>
                        <p>In hydroponics, fast growth and high yields are made possible by the use of concentrated minerals and macronutrients. 
                        But this success is often decided by the finest of margins. 
                        As a grower, you have to find the Goldilocks zone of nutrient strength to help your plants grow properly. 
                        If you add too many nutrients, your plants can be affected by a severe case of a nutrient burn. 
                        Too little may have them stunted and flowering poorly. The lesson to take away here is to keep a strict eye on your nutrient solution.</p>
                        <p>PPM here as a measure of water quality is important in hydroponics due to these facts. 
                        Different plants require different levels of PPM  to ensure optimized growth. 
                        As an example, lettuce requires a PPM level of 560-840ppm to grow optimally while celery requires a range of 1260-1400.</p>
                        <p>Hydroponic farmers growing a variety of crops need to be mindful of this and find the right balance of nutrient concentration if several crops are
                         being deployed nutrients from the same nutrient mix.</p>
                         <p>Doing research on each type of plant you grow can help you decide what can be grown in the current cycle if you aim to grow several types of crops together. 
                         However, to ensure fast growth and maximum yield in a shorter time, measure frequently and adjust accordingly.</p>
                        </Container>
                        
                    </Modal.Body> 
                    
                </Modal> 
        
        </div>
    )
}
