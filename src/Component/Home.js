import React, {Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

const cardCustom = {
    border: '1px solid mediumseagreen',
    padding: '10px',
    margin: '5px'
}

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            posts: [],
            selectedPosts: null,
            newPost: {
                title: "",
                body: ""
            },
            editPostId: null
        }
    }

    getPost() {
        axios.get('https://forumcompany.herokuapp.com/posts')
        .then(res => {
            let posts = res.data.Posts;
            console.log(posts);
            this.setState({posts})
        })
    }

    addPost = e => {
        let body = this.state.newPost;
        if(body.title == "" || body.body == ""){
            alert("Please fill Title and content for the post");
            return;
        }
        if(this.state.editPostId){
            this.editPost()
        } else{
            axios.post(`https://forumcompany.herokuapp.com/posts/`, body)
            .then(res => {
                console.log("Post Added");
                let newPost = {
                    title: "",
                    body: ""
                }
                this.setState({newPost})
                this.getPost();
            })
        }
    }

    openComments = (value) => {
        this.setState({selectedPosts: value})
        console.log(value);
    }

    componentWillMount() {
        this.getPost();
    }

    changeNewPost = e => {
        let newPost = this.state.newPost;
        let name = e.target.id;
        newPost[name] = e.target.value;
        this.setState({newPost})
    }

    removePost = e => {
        let post_id = e.target.id;
        axios.delete(`https://forumcompany.herokuapp.com/posts/${post_id}`)
        .then(res => {
            this.getPost();
        })
    }

    editPost = () => {
        let editPostId =  this.state.editPostId;
        let body = this.state.newPost;
        axios.put(`https://forumcompany.herokuapp.com/posts/${editPostId}`,body)
        .then(res => {
            this.getPost();
            this.setState({editPostId:null});
            console.log("Post Added");
            let newPost = {
                title: "",
                body: ""
            }
            this.setState({newPost})
        })
    }

    onEditPostStarted = element => {
        let editPostId = element.id;
        this.setState({editPostId});
        let newPost = {
            body: element.body,
            title: element.title
        }
        this.setState({newPost});
        window.scrollTo(0, 0);
    }

    render() {
        return(
            <div>
                <h1>Home</h1>
                <input className="form-control" id="title" onChange={e => this.changeNewPost(e)} value={this.state.newPost.title} type="text" placeholder="Title" maxLength="300"></input>
                <br />
                <textarea class="form-control" id="body" onChange={e => this.changeNewPost(e)} value={this.state.newPost.body} rows="5" placeholder="Enter the content here"></textarea>
                <br></br>
                <button class="btn btn-primary" onClick={e=> this.addPost(e)}>Add a New Post</button>
                <br />
                <div>
                    {this.state.posts.map((element, index) => {
                        return(
                            <div key={element.id} id={element.id} className="card" style={cardCustom}>
                                <div className="card-body">
                                    <h5 className="card-title">{element.title}</h5>
                                    <p className="card-text-2">{element.body}</p>
                                    <button class="btn btn-warn" id={element.id} onClick={e=> this.onEditPostStarted(element)}>Edit</button>
                                    &nbsp;
                                    <button class="btn btn-danger" id={element.id} onClick={e=> this.removePost(e)}>Delete</button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Link to={{pathname: "/post", state: {element}}} className="card-link">show more..</Link>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Home;