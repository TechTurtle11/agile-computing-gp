import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";


const Label = props => (
  <tr>
    <td>{props.label.string}</td>
    <td>{props.label.score}</td>
    <td>
      <a href="#" onClick={() => { props.deleteLabel(props.label._id) }}>X</a>       
    </td>
  </tr>
)

const Task = props => (
    <tr>
      <td>{props.task.title}</td>
      <td>
        <Link to={"/view/"+props.task._id}>View</Link>
      </td>
    </tr>
  )
  

export default class ProfileView extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeFreeText = this.onChangeFreeText.bind(this);
    this.onChangeLink1 = this.onChangeLink1.bind(this);
    this.onChangeLink2 = this.onChangeLink2.bind(this);

    this.state = {
      username: '',
      email: '',
      too_busy: false,
      links: [],
      link1: '',
      link2: '',
      free_text: '',
      assigned_tasks: [],
      labels: [],
      is_admin: false
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/users/get_by_id/'+this.props.match.params.id)
      .then(response => {
        this.setState({
          username: response.data.username,
          free_text: response.data.free_text,
          email: response.data.email,
          links: response.data.links,
          link1: response.data.links[0],
          link2: response.data.links[1],
          labels: response.data.nlp_labels,
          assigned_tasks: response.data.assigned_tasks,
          is_admin: response.data.is_admin
        })   
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangeFreeText(e) {
    this.setState({
      free_text: e.target.value
    })
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  onChangeLink1(e) {
      this.setState({
          link1: e.target.value
      })
  }

  onChangeLink2(e) {
    this.setState({
        link2: e.target.value
    })
}

  labelList() {
    return this.state.labels.map(currentlabel => {
 //     return <Label label={currentlabel} deleteLabel={this.deleteLabel} key={currentlabel._id}/>;
        return <Label label={currentlabel} key={currentlabel._id}/>; // got rid of the delete
    })
  }

  deleteLabel(label){
    if (this.state.labels.contains(label)){
        this.state.labels.delete(label);
    }
  }

  deleteUser(){
    
  }

  findLabels() {
    let userInfo = {
        text: this.state.free_text,
        link1: this.state.link1,
        link2: this.state.link2
    };
    axios.post('http://localhost:5000/nlptest/processProfile', userInfo)
      .then(response => {
        const modelOutput = response.data.modelOutput;
        const labels = modelOutput.map(x => <Label label={{
            string: x.label,
            score: x.probability
        }}/>);
        this.setState({
            labels: labels
        })
      })
  }

  currentAssignedTasks(){
    return this.state.assigned_tasks.map(currenttask => {
        return <Task task={currenttask} viewTask={this.viewTask} key={currenttask._id} />
    });
  }

  onSubmit(e) {
    e.preventDefault();

    this.state.links = [];
    this.state.links.push(this.state.link1);
    this.state.links.push(this.state.link2);

    const user = {
      username: this.state.username,
      email: this.state.email,
      links: this.state.links,
      free_text: this.state.free_text,
      nlp_labels: this.state.nlp_labels
    }

    console.log(user);

    axios.post('http://localhost:5000/users/update/' + this.props.match.params.id, user)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  render() {
    return (
    <div>
      <h3>Profile Details</h3>        
      <div className="pairBoxes">
          <div className="personalBoxView">
            <article>
              <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                  <label>Username: </label>
                  <input type="text"
                      className="form-control"
                      value={this.state.username}
                      onChange={this.onChangeUsername}>
                  </input>
                </div>
                <div className="form-group"> 
                  <label>Email: </label>
                  <input type="text"
                      className="form-control"
                      value={this.state.email}
                      onChange={this.onChangeEmail}>
                  </input>
                </div>
                <div className="form-group"> 
                <label>Link 1: </label>
                  <input  type="text"
                      className="form-control"
                      value={this.state.link1}
                      onChange={this.onChangeLink1}
                      />
                </div>
                <div className="form-group"> 
                  <label>Link 2: </label>
                  <input  type="text"
                      className="form-control"
                      value={this.state.link2}
                      onChange={this.onChangeLink2}
                      />
                </div>
                <div className="form-group"> 
                  <label>Free text: </label>
                  <textarea  type="text"
                      className="form-control"
                      value={this.state.free_text}
                      onChange={this.onChangeFreeText} />
                </div>
                <div className="form-group">
                  <label>Admin: </label>
                  <input  type="text"
                      className="form-control"
                      value={this.state.is_admin}
                      onChange={this.state.is_admin}
                      readonly="readonly"
                      />
                </div>
                <div className="form-group">
                  <input type="submit" value="Update your information" className="btn btn-primary" />
                </div>
                <div className="form-group">
                  <button type="button" id="red" onClick={ this.deleteUser.bind(this) }>Delete user</button>
                </div>
              </form>
            </article>
          </div>
          <div className="tagBoxView">
            <article>
              <div className="form-group">
                <button type="button" onClick={ this.findLabels.bind(this) }>Re-evaluate tags</button>
              </div> 
              <div className="form-group">
                <label>Biggest tags we identified from your links and free text: </label>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                          <th>String</th>
                          <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.labelList() }
                    </tbody>
              </table>
            </div>
            <div className="form-group">
              <br></br>
              <label>Currently assigned tasks: </label>
                <table className="table">
                    <tbody>
                        
                        { this.currentAssignedTasks() }
                    </tbody>
              </table>
            </div>
            </article>
          </div>
      </div>
    </div>
    )
  }
}