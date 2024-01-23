import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";

const ReplyModal = ({
  commentId,
  activityId,
  refresh,
  toggleRefresh,
  isReplyModalOpen,
  closeReplyModal,
  formatTimestamp,
}) => {
  const [replies, setReplies] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");
  const [replyContent, setReplyContent] = useState("");
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (!commentId || !isReplyModalOpen) return;

    const fetchCommentAndReplies = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/activities/${activityId}/comments`
        );
        const matchingComment = response.data.find(c => c._id === commentId);

        if (matchingComment) {
          setComment(matchingComment);
          setReplies(matchingComment.replies);
        } else {
          console.error("Matching comment not found");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentAndReplies();
  }, [commentId, isReplyModalOpen, apiUrl, refresh]);

  const handleReplyLike = async (replyId) => {
    setReplies(
      replies.map((reply) => {
        if (reply._id === replyId) {
          return {
            ...reply,
            isLiked: true,
            likes: reply.isLiked ? reply.likes : [...reply.likes, userId],
          };
        }
        return reply;
      })
    );

    try {
      await axios.post(
        `${apiUrl}/api/comments/${commentId}/replies/${replyId}/like`,
        { userId }
      );
    } catch (error) {
      console.error("Error liking reply:", error);
      setReplies(
        replies.map((reply) => {
          if (reply._id === replyId) {
            return {
              ...reply,
              isLiked: false,
              likes: reply.likes.filter((id) => id !== userId),
            };
          }
          return reply;
        })
      );
    }
  };

  const handleReplyUnlike = async (replyId) => {
    setReplies(
      replies.map((reply) => {
        if (reply._id === replyId) {
          return {
            ...reply,
            isLiked: false,
            likes: reply.likes.filter((id) => id !== userId),
          };
        }
        return reply;
      })
    );

    try {
      await axios.post(
        `${apiUrl}/api/comments/${commentId}/replies/${replyId}/unlike`,
        { userId }
      );
    } catch (error) {
      console.error("Error unliking reply:", error);
      setReplies(
        replies.map((reply) => {
          if (reply._id === replyId) {
            return {
              ...reply,
              isLiked: true,
              likes: reply.isLiked ? reply.likes : [...reply.likes, userId],
            };
          }
          return reply;
        })
      );
    }
  };

  const submitReply = async () => {
    if (!replyContent.trim()) {
      console.error("Cannot submit empty reply");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/activities/comment/${commentId}/reply`,
        {
          userId,
          replyContent,
        }
      );

      const updatedReplies = response.data.replies;

      setReplies(updatedReplies);
      setReplyContent("");

      toggleRefresh();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  if (!isReplyModalOpen) return null;

  return (
    <Modal
      show={true}
      onHide={closeReplyModal}
      centered
      className="modal fade modal-lg"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 overflow-hidden border-0 bg-brown-gradient-color">
          {/* Add modal content here: header, body (including replies and input field), and footer */}
          <div className="modal-body">
            {/* Loop through replies and display them */}
            {/* Add input field for new reply */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReplyModal;
