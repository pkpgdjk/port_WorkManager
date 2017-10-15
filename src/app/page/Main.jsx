import React, {Component} from 'react';
import TimeTable from '../component/timeline.jsx'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {Button,Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {
    BrowserRouter as Router,
    Redirect,
} from 'react-router-dom'
import AlertContainer from 'react-alert';
import {ENV} from '../config.jsx'

let API_URL = ENV.API_URL;


class Main extends Component{
    constructor(props){
        super(props);



        console.log(moment().format("YYYY-MM-DD"));
        this.state = {
            groups : [],
            items :  [],
            startDate: moment(),
            endDate:moment(),
            username:"",
            password:"",

            showModal:false,

            /// data
            wId:"",
            wTitle: "",
            wTemplateId:"",
            wWorker: "",
            wManager: "",
            wStartDate: moment(),
            wEndDate: moment(),
            wComment:"",
            wGgLink:"",
            wPaid:"",
            wState:"",
            wSubmitWorkLink:"",

            login:false,
            user:"",
            type:"",




        }
    }


    onItemClick(item,e){

        axios.get(`${API_URL}/api/getWorkData.php?id=${item}`)
            .then(res => {

                // map
                this.setState({
                    wId:res.data.data[0].id,
                    wTitle: res.data.data[0].Title,
                    wTemplateId: res.data.data[0].templateId,
                    wWorker: res.data.data[0].owner,
                    wManager: res.data.data[0].manager,
                    wStartDate: moment(res.data.data[0].StartDate),
                    wEndDate: moment(res.data.data[0].EndDate),
                    wComment:res.data.data[0].comment,
                    wGgLink:res.data.data[0].googleLink,
                    wPaid:res.data.data[0].total,
                    wState:res.data.data[0].state,
                    wSubmitWorkLink:res.data.data[0].workerLink,
                });
                console.log(moment(res.data.data[0].startDate),res.data.data[0].startDate);

            });

        this.toggle();
    }

    toggle(s) {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    onLoginClick(){
        let user;
        let login = false;
        if (this.state.username !== "" && this.state.password !== ""){
            axios.get(`${API_URL}/api/getWork.php?username=${this.state.username}&password=${this.state.password}`)
                .then(res => {
                    console.log(res);
                    user = res.data.user;
                    if(res.data.user.type ==="admin" ||  res.data.user.type ==="reception"){
                        login = true;
                    }
                     if (res.data.status === 200){
                         let items = res.data.item.map(obj => {
                             return({
                                 id: obj.id,
                                 group: obj.id,
                                 title: <strong>{obj.state + ((obj.workerSubmit === '1')? ' [ส่งงานแล้ว]':"")}</strong>,
                                 start_time: moment(obj.StartDate).startOf("day"),
                                 end_time: moment(obj.EndDate).endOf("day"),
                                 className:obj.state
                             })
                         } );

                         let groups = res.data.group.map(obj => {
                             return({
                                 id: obj.id,
                                 title: obj.Title
                             })
                         } );


                         console.log("user  ", user);
                         this.setState({
                             items:items,
                             groups:groups,
                             login:login,
                             user:user.username,
                             type:user.type
                         });
                     }else if (res.data.status === 'error'){
                         console.log(res.data.error);
                         this.setState({
                             items:[],
                             groups:[]
                         });
                     }
                });
        }
    }


    onSubmitWork(){
        console.log(this.state.wId,1,this.state.wSubmitWorkLink);

        if (this.state.wSubmitWorkLink ===''){
            this.showAlert("กรุณากรอกข้อมูล่อน","error");
        }else {
            axios.get(`${API_URL}/api/submitWork.php?id=${this.state.wId}&link=${this.state.wSubmitWorkLink}`)
                .then(res => {
                    if (res.data.status === 200){
                        this.showAlert("ส่งข้อมูล สำเร็จ","success");
                        this.toggle();
                    }else {
                        this.showAlert("ส่งข้อมูล ล้มเหลว กรุณาติดต่อ ทีมมงาน","error");
                    }
                })
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }


    alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'light',
        time: 5000,
        transition: 'scale'
    };

    showAlert = (msg,status) => {
        this.msg.show(msg, {
            time: 2000,
            type: status,
            icon: <img src= {`img/${status}.png`} />
        })
    };



    render(){

        if(this.state.login){
            return(
                <Redirect to={"/manager/"+this.state.user}/>
            )
        }

        return(
            <div>
                <div className="form-group form-inline justify-content-center ">
                    <input className="form-control col-md-3 mr-2" id="inputUsername"  placeholder="Username"
                           onChange={e=> this.setState({username:e.target.value})} />
                    <input className="form-control col-md-3 mr-2" id="inputPassword" type="password"  placeholder="Password"
                           onChange={e=> this.setState({password:e.target.value})} />
                    <button className="btn btn-success" onClick={this.onLoginClick.bind(this)}> ดูงาน </button>
                </div>

                <div className="border border-danger">
                    <TimeTable items={this.state.items} groups={this.state.groups} onItemClick={this.onItemClick.bind(this)} />
                </div>






                <Modal isOpen={this.state.showModal} size="lg" toggle={()=>{this.toggle() }} >
                    <ModalHeader toggle={()=>{
                        this.toggle();
                    }}>รายละเอียดงาน</ModalHeader>
                    <ModalBody>


                        <div >
                            <div className="row">
                                <div className="col-md-3"> <h4>ชื่อ : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wTitle}</small></h4> </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3"> <h4>รหัส portfolio : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wTemplateId}</small></h4> </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3"> <h4>ผู้มอบหมายงาน : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wManager}</small></h4> </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3"> <h4>วันที่รับงาน : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wStartDate.format("DD-MM-YYYY")}</small></h4> </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3"> <h4>กำหนดส่งงาน : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wEndDate.format("DD-MM-YYYY")}</small></h4> </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3"> <h4>Google Link : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wGgLink}</small></h4> </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3"> <h4>สถานะ : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wState}</small></h4> </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3"> <h4>เพิ่มเติม : </h4></div>
                                <div className="col-md"> <h4><small className="text-muted">{this.state.wComment}</small></h4> </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3"> <h4>ส่งงาน (google link) : </h4></div>
                                <div className="col-md">
                                    <input type="text " value={this.state.wSubmitWorkLink} className="form-control" name="wSubmitWorkLink" onChange={this.handleInputChange.bind(this)}/>
                                </div>
                            </div>

                        </div>




                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary"  onClick={()=>{ this.toggle() }}>ยกเลิก</Button>
                        <Button color="success"  onClick={()=>{ this.onSubmitWork() ; }}>ส่งงาน</Button>
                        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                    </ModalFooter>
                </Modal>

            </div>
        );
    };


}

Main.propTypes = {};
Main.defaultProps = {};

export default Main;
