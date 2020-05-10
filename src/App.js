import React,{Component} from 'react';
import './App.css';
import axios from 'axios';
import loadingGif from './Loading.gif';

import ListItem from './ListItem'

class App extends Component{
  constructor(){
    super();
    this.state={
      newTodo:'',
      editing: false,
      editingIndex: null,
      notification:null,
      todos:[],
      loading: true
    };
    this.apiUrl='https://5eb65c4d875f1a00167e0bfb.mockapi.io/';
    this.handleChange=this.handleChange.bind(this);
    this.addTodo=this.addTodo.bind(this);
    this.deleteTodo=this.deleteTodo.bind(this);
    this.editTodo=this.editTodo.bind(this);
    this.updateTodo=this.updateTodo.bind(this);
    this.alert=this.alert.bind(this);

  }

  async componentDidMount(){
    const response= await axios.get(`${this.apiUrl}/todos`)
    setTimeout(()=>{
      this.setState({
        todos: response.data,
        loading: false
      });
    },1000)
  }

  handleChange(event){
   
      this.setState({
      newTodo:event.target.value
    });
  }

  

  async addTodo(event){
    console.log('add todo')
      
    // this.state.todos.push(newTodo);

    const response = await axios.post(`${this.apiUrl}/todos`,{
      name:this.state.newTodo
    });
    console.log(response);

    const todos = this.state.todos;
    todos.push(response.data);
    this.setState({
      todos: todos,
      newTodo:''
    });
    this.alert('Todo added successfully.')
  }

  alert(notification){
    this.setState({
      notification
    });

    setTimeout(()=>{
      this.setState({notification:null})
    },2000);
  }

  async deleteTodo(index){
    const todos=this.state.todos;
    const todo = todos[index]
    delete todos[index];
    await axios.delete(`${this.apiUrl}/todos/${todo.id}`)
    this.setState({todos});
    this.alert('Todo deleted successfully.')
  }

  editTodo(index){
    const todo=this.state.todos[index];
    this.setState({
      editing: true,
      newTodo:todo.name,
      editingIndex: index
    });
  }

  async updateTodo(){
    const todo=this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`,{name:this.state.newTodo})

    
    const todos=this.state.todos;
    todos[this.state.editingIndex]=response.data;
    this.setState({todos,editing:false,editingIndex:null,newTodo:''});
    console.log(response);

    this.alert('Todo updated successfully.');
  }

  render(){
    return(
      <div className="App">
      <header className="App-header"></header>
        {this.state.notification &&
        <div className="alert mt-3 alert-success">
          <p className="text-center">{this.state.notification}</p>
        </div>
        }
        <div className="container">

        <input 
        type="text"
        //name="todo"
        className="my-4 form-control"
        placeholder="Add a new todo"
        onChange={this.handleChange}
        value={this.state.newTodo}
        />
        <button 
          onClick={this.state.editing? this.updateTodo : this.addTodo}
          className="btn-info mb-3 form-control"
          disabled ={this.state.newTodo.length < 5}>
          {this.state.editing ? 'Update Todo' : "Add Todo"}
          
        </button>

        {
          this.state.loading &&
          <img src={loadingGif} alt=""/>
        }

        {
          (!this.state.editing||this.state.loading) &&
            <ul className="list-group">
          {this.state.todos.map((item,index)=>{
            return <ListItem
              key={item.id}
              item={item}
              editTodo={()=>{this.editTodo(index);}}
              deleteTodo={()=>{this.deleteTodo(index);}}
              />;
          })}
          </ul>
        }
      </div>
      </div>
    )
  };
}

export default App;
