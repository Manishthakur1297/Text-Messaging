import React, {Component} from 'react';

import { Modal, Button } from 'react-bootstrap';

import { Row, FormGroup, FormControl, FormLabel, FormText } from 'react-bootstrap';

import { isEmpty } from '../shared/validator';

import { axiosInstance }  from "../service/axiosApi";

class CustomModal extends Component{

    state = {
        users : {},
        errors: {}
    }

    componentDidMount(){
        this.setState({users:this.props.user})
        console.log(this.props.user)
    }

    hide = () => {
        this.props.hide();
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let { users } = this.state;
        users[name] = value;

        this.setState({
            users: users
        });
    }

    validateLoginForm = (e) => {

        let errors = {};
        const { users } = this.state;

        if (isEmpty(users.name)) {
            errors.name = "Username can't be blank";
        }

        if (isEmpty(users.email)) {
            errors.email = "Email can't be blank";
        }

        if (isEmpty(users.password)) {
            errors.password = "Password can't be blank";
        }

        if (isEmpty(users.max_calorie)) {
            errors.max_calorie = "Max Calorie can't be blank";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }
    }

    updateUser = (async event => {
        event.preventDefault();
        try {
            console.log(this.state.users)
            const res = await axiosInstance.put(`/users/${this.state.users.id}/`, {
                //id: [].concat(this.state.users.id),
                name: [].concat(this.state.users.name),
                email: [].concat(this.state.users.email),
                max_calorie: [].concat(this.state.users.max_calorie.toString()),
                password: [].concat(this.state.users.password)

            });
            console.log(res)
            this.props.hide()
            //window.location.href = '/'
            //return res;
        } catch (error) {
            alert("Error : Please enter valid details")
            throw error;
        }
    });



    render(){

        const { errors } = this.state;

        return (
            <div>
                
                 <Modal show={this.props.show} onHide={this.hide} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Update User!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="Login">
                        <Row>
                            <form onSubmit={this.updateUser}>
                                <FormGroup>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl type="text" name="name" placeholder={this.state.users.name} onChange={this.handleInputChange} />
                                { errors.name &&
                                    <FormText>{errors.name}</FormText>
                                }
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl name="email" type="text" disabled
                                        placeholder={this.state.users.email} />
                                { errors.email &&
                                    <FormText>{errors.email}</FormText>
                                }
                                </FormGroup>

                                <FormGroup>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl name="password" type="password" 
                                        placeholder="Enter New Password" onChange={this.handleInputChange} />
                                { errors.password &&
                                    <FormText>{errors.password}</FormText>
                                }
                                </FormGroup>

                                <FormGroup>
                                    <FormLabel>Max Calorie</FormLabel>
                                    <FormControl name="max_calorie"  type="number" step="0.01" min="0" max="10000" 
                                    placeholder={this.state.users.max_calorie} onChange={this.handleInputChange} />
                                { errors.max_calorie &&
                                    <FormText>{errors.max_calorie}</FormText>
                                }
                                </FormGroup>
                                {/* <Button type="submit">Update</Button> */}
                            </form>
                        </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hide}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.updateUser}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}

export default CustomModal;