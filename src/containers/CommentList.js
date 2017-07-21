import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import CommentList from '../components/CommentList'
import { initComments, deleteComment } from '../reducers/comments'

//CommentListContainer
//一个Smart组件，负责评论列表数据的加载、初始化、删除评论
//沟通CommentList和state

class CommentListContainer extends Component {
  static propTypes = {
    comments:PropTypes.array,
    initComments: PropTypes.func,
    onDeleteComment: PropTypes.func
  }

  componentWillMount(){
    //初始化评论
    this._loadComments()
  }
  _loadComments(){
    //从LoaclStorage中加载评论
    let comments = localStorage.getItem('comments')
    comments = comments ? JSON.parse(comments) : []
    //this.props.initComments是connect传进来的
    //可以帮我们把数据初始化到state里面去
    this.props.initComments(comments)
  }

  handleDeleteComment (index) {
    const { comments } = this.props
    //props是不能变的，所以这里新建一个删除了特定下标的评论列表
    const newComments = [
      ...comments.slice(0, index),
      ...comments.slice(index + 1)
    ]
    //保留最新的评论列表到LocalStorage
    localStorage.setItem( 'comments', JSON.stringify(newComments))
    if(this.props.onDeleteComment){
      //this.props.onDeleteComment是connect传进来的
      //会dispatch 一个 action 去删除评论
      this.props.onDeleteComment(index)
    }
  }
  /*对于CommentList，可以看到它接受两个参数：comments和onDeleteComment*/ 
  render () {
    return (
      <CommentList 
        comments={this.props.comments}
        onDeleteComment={this.handleDeleteComment.bind(this)}  />
    )
  }
}

//评论列表从state.comments中获取
const mapStateToProps = (state) => {
  return {
    comments: state.comments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //提供给CommentListContainer
    //当从LocalStorage加载评论列表以后就会通过这个方法
    //把评论列表初始化到state当中
    initComments: (comments) => {
      dispatch(initComments(comments))
    },
    //删除评论
    onDeleteComment: (commentIndex) =>{
      dispatch(deleteComment(commentIndex))
    }
  }
}

//将CommentListContainer connect到 store
//会把comments，initComments，onDeleteComment传给  CommentListContainer

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentListContainer)