import React, {Component} from 'react';
import PropTypes from 'prop-types'
import TimeTable from '../component/timeline.jsx'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {Button,Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, FormText,Col} from 'reactstrap'
import {ENV} from '../config.jsx'

let API_URL = ENV.API_URL;


class manager extends Component {
    constructor(props){
        super(props);
        this.state = {
            groups: [],
            items: [],
            showModal: false,


            //inputbox

            wId:0,
            wTitle: "",
            wTemplateId: "",
            wWorker: "",
            wManager: this.props.match.params.user,
            wStartDate: moment(),
            wEndDate: moment(),
            wComment:"",
            wGgLink:"",
            wPaid:"",
            wState:"order",
            wSubmitWorkLink:"",
            wSubmitWorkStatus:"",
            wBooking:'false',


            modalState:"",

            user:this.props.match.params.user,
            stateCount:{},

            FilterType:"filterAll",
            FilterTxt:"",

            listWorker:[]



        };

        this.handleInputChange = this.handleInputChange.bind(this);


    }


    toggle(s) {
        this.setState({
            modalState:(!this.state.showModal)?s:"",
            showModal: !this.state.showModal
        });
        console.log(this.state.wManager);
    }
    handleChange(type,date){
        if (type === "startDate"){
            this.setState({
                wStartDate: date.startOf("day")
            });
        }else if (type ==="endDate"){
            this.setState({
                wEndDate: date.endOf("day")
            });
        }

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked.toString() : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });


    }

    onModalSaveClick(){

        let {wTitle,wTemplateId,wWorker,wManager,wComment,wState,wGgLink,wPaid,modalState,wBooking} = this.state;
        let wStartDate = this.state.wStartDate.format("YYYY-MM-DD");
        let wEndDate = this.state.wEndDate.format("YYYY-MM-DD");
        let wId = (modalState ==="edit")?this.state.wId:0;



            axios.get(`${API_URL}/api/addWork.php`, {
            params: {
                wId,wTitle,wTemplateId,wWorker,wManager,wComment,wState,wGgLink,wPaid,wStartDate,wEndDate,modalState,wBooking
            }
            })
            .then(
                ()=>{
                    this.refreshTimeLine();
                    this.toggle();
                    this.clearWorkState();
                }

            )
            .catch(function (error) {
                console.log(error);
            });


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
                    wStartDate: moment(res.data.data[0].StartDate),
                    wEndDate: moment(res.data.data[0].EndDate),
                    wComment:res.data.data[0].comment,
                    wGgLink:res.data.data[0].googleLink,
                    wPaid:res.data.data[0].total,
                    wState:res.data.data[0].state,
                    wManager:res.data.data[0].manager,
                    wSubmitWorkStatus:res.data.data[0].workerSubmit,
                    wSubmitWorkLink:res.data.data[0].workerLink,
                    wBooking:res.data.data[0].booking,
                });
                console.log("OnItemClick ",res.data.data[0]);

            });


        this.toggle('view');
    }
    clearWorkState(){
        this.setState({
            wTitle: "",
            wTemplateId: "",
            wWorker: "",
            wStartDate: moment(),
            wEndDate: moment(),
            wComment:"",
            wGgLink:"",
            wPaid:"",
            wState:"order",
        });


    }

    onModalEditClick(){
        this.setState({
            modalState:"edit"
        });

    }

    refreshTimeLine(){
        axios.get(`${API_URL}/api/getAllWork.php?reception=` + (this.state.user))
            .then(res => {
                console.log(res);
                if (res.data.status === 200){
                    let stateCount = {};
                    let items = res.data.item.map(obj => {
                        stateCount[obj.state] = (stateCount[obj.state]||0)+1;
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
                    console.log("stateCount", stateCount);
                    this.setState({
                        items:items,
                        groups:groups,
                        stateCount:stateCount,
                    });
                }else if (res.data.status === 'error'){
                    console.log(res.data.error);
                    this.setState({
                        items:[],
                        groups:[]
                    });
                }
            });
        console.log("state count ",this.state.stateCount);
    }
    componentDidMount(){
       this.refreshTimeLine();
       this.loadWorker();
    }

    onFilterSubmitClick(e){
        e.preventDefault();

        axios.get(`${API_URL}/api/getAllWork.php?filterType=${this.state.FilterType}&filterTxt=${this.state.FilterTxt}&reception=${this.state.user}` )
            .then(res => {
                console.log(res);
                if (res.data.status === 200){
                    let stateCount = {};
                    let items = res.data.item.map(obj => {
                        stateCount[obj.state] = (stateCount[obj.state]||0)+1;
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
                    console.log("stateCount", stateCount);
                    this.setState({
                        items:items,
                        groups:groups,
                        stateCount:stateCount,
                    });
                }else if (res.data.status === 'error'){
                    console.log(res.data.error);
                    this.setState({
                        items:[],
                        groups:[]
                    });
                }
            });

        return false;
    }

    loadWorker(){
        let users = [];
        axios.get(`${API_URL}/api/getWorker.php?reception=${this.state.user}` )
            .then(res => {
               users.push(res.data.data.map(obj=>{
                   return(<option value={obj.username}>{obj.username}</option>);
               }));
            });

        this.setState({
            listWorker:users,
        });



    }

    render() {
        let disabled = (this.state.modalState === "view")
        let modalBtn;
        if (this.state.modalState ==="view"){
            modalBtn = <Button color="warning" onClick={this.onModalEditClick.bind(this)}>แก้ไข</Button>
        }else{
            modalBtn = <Button color="success" onClick={this.onModalSaveClick.bind(this)}>ตกลง</Button>
        }

        let filterHtml;
        if (this.state.user ==="admin"){
            filterHtml = (<form className="form-inline">
                <button className="btn btn-primary col-md-2" onClick={(e)=>{
                    e.preventDefault();
                    this.toggle("add");
                    return false;
                }}>Add</button>

                <label className="mr-sm-2 ml-auto" htmlFor="selectFilter">ตัวกรอง :</label>
                <Input className="col-md-2" id="selectFilter" type="select" name="FilterType" onChange={this.handleInputChange} defaultValue="FilterAll" >
                    <option value="filterAll">ทั้งหมด</option>
                    <option value="filterWorker">ชื่อ Worker</option>
                    <option value="filterReception">ชื่อ Reception</option>
                </Input>

                <input className=" ml-2 form-control" name="FilterTxt" type="text" placeholder="กรอกข้อมูลที่ต้องการกรอง" onChange={this.handleInputChange} />
                <button className="btn btn-success col-md-1 ml-1" onClick={this.onFilterSubmitClick.bind(this)}>ตกลง</button>

            </form>)
        }else{
            filterHtml = (<form className="form-inline">
                <button className="btn btn-primary col-md-2" onClick={(e)=>{
                    e.preventDefault();
                    this.toggle("add");
                    return false;
                }}>Add</button>

                <label className="mr-sm-2 ml-auto" htmlFor="selectFilter">ตัวกรอง :</label>
                <Input className="col-md-2" id="selectFilter" type="select" name="FilterType" onChange={this.handleInputChange} defaultValue="FilterAll" >
                    <option value="filterAll">ทั้งหมด</option>
                    <option value="filterWorker">ชื่อ Worker</option>
                </Input>

                <input className=" ml-2 form-control" name="FilterTxt" type="text" placeholder="กรอกข้อมูลที่ต้องการกรอง" onChange={this.handleInputChange} />
                <button className="btn btn-success col-md-1 ml-1" onClick={this.onFilterSubmitClick.bind(this)}>ตกลง</button>
            </form>)
        }



        let workerInput,stateInput;
        if (disabled){
            workerInput =(
                <input value={this.state.wWorker} className="form-control" id="inputWorker" name="wWorker" onChange={this.handleInputChange}  disabled/>
            )
            stateInput = (
                <Col sm={10}>
                    <Input value={this.state.wState} type="text" id="selectState" name="wState" onChange={this.handleInputChange}  disabled={disabled} />
                </Col>
            )
        }else{
            workerInput = (
                <select className="form-control" id="inputWorker" name="wWorker" onChange={this.handleInputChange} >
                    {this.state.listWorker}
                </select>
            )
            stateInput = (
                <Input id="selectState" type="select" name="wState" onChange={this.handleInputChange} disabled={disabled} >
                    <option value="order">สั่งซื้อ</option>
                    <option value="deposit">มัดจำ</option>
                    <option value="ready">ข้อมูลพร้อม</option>
                    <option value="process">ดำเนินการ</option>
                    <option value="paid">ชำระส่วนที่เหลือแล้ว</option>
                    <option value="complete">เสร็จสิ้น</option>
                    <option value="cancel">ยกเลิก</option>
                    {(this.state.user ==="admin")?<option value="finish">ปิดรอบ</option>:""}
                </Input>
            )
        }

        let workerSubmitWork = "";
        if(this.state.wSubmitWorkStatus === "1"){

            workerSubmitWork = (
                <FormGroup row>
                    <Label for="inputComment" sm={2}><div className="txtComplete"> ส่งงาน :</div></Label>
                    <Col sm={10}>
                        <Input value={this.state.wSubmitWorkLink} type="text"  disabled/>
                    </Col>
                </FormGroup>
            )
        }

        return (
            <div>
                <div className="mt-3 mb-2">
                    {filterHtml}
                </div>

                <div className="border border-danger">
                    <TimeTable items={this.state.items} groups={this.state.groups} onItemClick={this.onItemClick.bind(this)} />
                </div>

                <div className="text-right">
                    <h6 className="txtOrder"> สั่งซื้อ : {this.state.stateCount.order||0}  งาน </h6>
                    <h6 className="txtDeposit"> มัดจำ : {this.state.stateCount.deposit||0}  งาน </h6>
                    <h6 className="txtReady"> ข้อมูลพร้อม : {this.state.stateCount.ready||0}  งาน </h6>
                    <h6 className="txtProceed"> ดำเนินการ : {this.state.stateCount.process||0}  งาน </h6>
                    <h6 className="txtPaid"> ชำระส่วนที่เหลือแล้ว : {this.state.stateCount.paid||0}  งาน </h6>
                    <h6 className="txtComplete"> เสร็จสิ้น : {this.state.stateCount.complete||0}  งาน </h6>
                    <h6 className="txtCancel"> ยกเลิก : {this.state.stateCount.cancel||0}  งาน </h6>

                </div>






                <Modal isOpen={this.state.showModal} size="lg" toggle={()=>{this.toggle();this.clearWorkState() }} >
                    <ModalHeader toggle={()=>{
                        this.toggle();
                        this.clearWorkState() }}>Reception</ModalHeader>
                    <ModalBody>
                        <form action="">
                        <FormGroup row>
                            <Label for="inputTitle" sm={2}>ชื่อ :</Label>
                            <Col sm={10}>
                                <Input value={this.state.wTitle} type="text" id="inputTitle" placeholder="ชื่องาน" name="wTitle" onChange={this.handleInputChange}  disabled={disabled} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="inputTemplateId" sm={2}>รหัส port :</Label>
                            <Col sm={10}>
                                <Input value={this.state.wTemplateId} type="text" id="inputTemplateId" placeholder="รหัส port" name="wTemplateId" onChange={this.handleInputChange}  disabled={disabled} />
                            </Col>
                        </FormGroup>

                        {/*<FormGroup row>*/}
                            {/*<Label for="inputWorker" sm={2}>Worker :</Label>*/}
                            {/*<Col sm={10}>*/}
                                {/*<Input value={this.state.wWorker} type="text" id="inputWorker" placeholder="Worker" name="wWorker" onChange={this.handleInputChange} disabled={disabled} />*/}
                            {/*</Col>*/}
                        {/*</FormGroup>*/}


                        <div className="form-group row" >
                            <label htmlFor="inputWorker" className="col-md-2 col-form-label">Worker :</label>
                            <div className="col-md-10">
                                {workerInput}

                            </div>

                        </div>


                        <FormGroup row>
                        <Label for="inputManager" sm={2}>Receptionist :</Label>
                        <Col sm={10}>
                            <Input value={this.state.wManager} type="text" id="inputManager" placeholder="Receptionist" name="wManager" onChange={this.handleInputChange}  disabled />
                        </Col>
                    </FormGroup>

                        <FormGroup row>
                            <Label for="inputStartDate" sm={2}>รับงาน :</Label>
                            <Col sm={10}>
                                <DatePicker
                                    id="inputStartDate"
                                    selected={this.state.wStartDate}
                                    onChange={this.handleChange.bind(this,"startDate")}
                                    disabled={disabled}
                                    dateFormat="DD/MM/YYYY"
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="inputEndDate" sm={2}>ส่งงาน :</Label>
                            <Col sm={10}>
                                <DatePicker
                                    id="inputEndDate"
                                    selected={this.state.wEndDate}
                                    onChange={this.handleChange.bind(this,"endDate")}
                                    disabled={disabled}
                                    dateFormat="DD/MM/YYYY"
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="inputGgLink" sm={2}>Google Drive Link :</Label>
                            <Col sm={10}>
                                <Input value={this.state.wGgLink} type="text" id="inputGgLink" placeholder="Google Drive Link" name="wGgLink" onChange={this.handleInputChange}  disabled={disabled} />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="inputPaid" sm={2}>จ่ายแล้ว :</Label>
                            <Col sm={10}>
                                <Input value={this.state.wPaid} type="text" id="inputPaid" placeholder="จ่ายแล้ว" name="wPaid" onChange={this.handleInputChange}  disabled={disabled} />
                            </Col>
                        </FormGroup>


                        <FormGroup row>
                            <Label for="inputComment" sm={2}>เพิ่มเติม :</Label>
                            <Col sm={10}>
                                <Input value={this.state.wComment} type="text" id="inputComment" placeholder="เพิ่มเติม" name="wComment" onChange={this.handleInputChange}  disabled={disabled} />
                            </Col>
                        </FormGroup>

                            {workerSubmitWork}

                        <FormGroup>
                            <Label for="selectState">สถานะ :</Label>
                            {stateInput}
                        </FormGroup>

                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox"  checked={(this.state.wBooking=='true')} name="wBooking" onChange={this.handleInputChange} disabled={disabled}/>
                                         สั่งทำเล่ม
                                </label>
                            </div>
                        </form>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary"  onClick={()=>{
                            this.toggle();
                            this.clearWorkState() }}>ยกเลิก</Button>
                        {modalBtn}
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

manager.propTypes = {};
manager.defaultProps = {};

export default manager;
