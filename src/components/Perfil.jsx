import React, {Component} from 'react';
import {Card} from "react-bootstrap";
import {UserContext} from "./UserContext";
import {Navigate } from "react-router-dom";

class Perfil extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.state = {
            user: {}
        };
    }

    checkProps = () => {
        const context = this.context;
        if (this.props.user) {
            this.setState({user:this.props.user});
            this.setState({loggedIn:this.props.loggedIn});
        } else if (this.context.user) {
            this.setState({user:context.user});
            this.setState({loggedIn:context.loggedIn});
        }
    }

    componentDidMount() {
        this.checkProps();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const context = this.context;
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})
            this.setState({loggedIn:this.props.loggedIn})
        }
        if (prevState.user !== this.state.user) {
            this.setState({user: context.user})
            this.setState({loggedIn:context.loggedIn})
        }
    }


    render() {

        if (this.context.loggedIn === false) {
            return <Navigate to="/login" />
        }

        return (
            <div className="container-sm">
                <br/><br/><br/><br/>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white"><i className="bi bi-person-lines-fill" /> Meus dados</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.user.name}</Card.Title>
                                <Card.Text>
                                    Email: {this.state.user.email}</Card.Text>
                                <Card.Text>
                                    ID: {this.state.user.id}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <br/><br/><br/><br/>
            </div>
        );
    }
}

export default Perfil;