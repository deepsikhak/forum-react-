import React, {Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

const cardCustom = {
    border: '1px solid mediumseagreen',
    padding: '10px'
}

class Post extends Component {

    constructor(props) {
        super(props);
        let element = this.props.location && this.props.location.state && this.props.location.state.element;
        // console.log(this.props);
        console.log(element);
        this.state = {
            posts: element,
            comments: [],
            newCommentContent: "",
            editCommentId: null
        }
        if(element) {
            this.setState({posts: element});
            this.getComments(element.id);
        }
    }

    getComments(id) {
        axios.get(`https://forumcompany.herokuapp.com/posts/${id}`)
        .then(res => {
            let comments = res.data.comment;
            console.log(comments);
            this.setState({comments});
        })
    }

    removeComment = e => {
        let post_id = this.state.posts.id;
        let comment_id = e.target.id;
        axios.get(`https://forumcompany.herokuapp.com/posts/${post_id}/comments/${comment_id}/soft_delete`)
        .then(res => {
            this.getComments(post_id);
        })
    }

    changeNewComment = e => {
        let newCommentContent = e.target.value;
        this.setState({newCommentContent})
    }

    addComment = () => {
        if(this.state.newCommentContent === ""){
            alert("Please Enter the comment before submitting");
            return;
        }
        let body = {
            content: this.state.newCommentContent
        }
        if(this.state.editCommentId){
            this.editComment(body);
        } else{
            let post_id = this.state.posts.id;
            axios.post(`https://forumcompany.herokuapp.com/posts/${post_id}/comments`, body)
            .then(res => {
                this.getComments(post_id);
                let newCommentContent = "";
                this.setState({newCommentContent});
            })
        }
    }

    editComment = (body) => {
        let post_id = this.state.posts.id;
        let editCommentId = this.state.editCommentId;
        axios.patch(`https://forumcompany.herokuapp.com/posts/${post_id}/comments/${editCommentId}/`,body)
        .then(res => {
            this.getComments(post_id);
            this.setState({editCommentId:null});
            console.log("Comment Added");
            let newCommentContent = "";
            this.setState({newCommentContent});
        })
    }

    onEditCommentStarted = (comment) => {
        let editCommentId =  comment.id;
        let newCommentContent = comment.content;
        this.setState({editCommentId});
        this.setState({newCommentContent});
        window.scrollTo(0, 0);
    }

    render() {
        return(
            <div>
                <center><h1>Post - {this.state.posts ? this.state.posts.id: ""}</h1></center>
                <h4>{this.state.posts ? this.state.posts.title : "NA"}</h4>
                <p>{this.state.posts ? this.state.posts.body : "NA"}</p>
                <br />
                <textarea id="content" value={this.state.newCommentContent} onChange={e=> this.changeNewComment(e)}  className="form-control" type="text" placeholder="Write your comments" rows="2" maxLength="500"></textarea>
                <br />
                <button onClick={e=> this.addComment(e)} className="btn btn-primary btn-lg">Submit</button>                
                <br />
                <br />
                <div>
                    {this.state.comments.map((comment, index) => {
                        return(
                            <div key={comment.id} id={comment.id} className="card" style={cardCustom}>
                                <div className="card-body">
                                    <h5 className="card-title">{comment.id}</h5>
                                    <p className="card-text-2">{comment.content}</p>
                                    <button className="btn btn-warn" id={comment.id} onClick={e=> this.onEditCommentStarted(comment)}>Edit</button>
                                    &nbsp;
                                    <button className="btn btn-danger" id={comment.id} onClick={e=> this.removeComment(e)}>Remove</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Post;