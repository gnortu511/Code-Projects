import Heading from "components/layout/Heading";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebase-app/firebase-config";

const PostReleat = ({ categoryId = "" }) => {
  const [postRelated, setPostRelated] = useState([]);
  useEffect(() => {
    const docRef = query(
      collection(db, "post"),
      where("categoryId", "==", categoryId)
    );
    onSnapshot(docRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostRelated(results);
    });
  }, [categoryId]);
  console.log("postRelated", postRelated);
  if (!categoryId || postRelated.length <= 0) return null;
  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary">
        {postRelated.length > 0 &&
          postRelated.map((post) => (
            <PostItem key={post.id} data={post}></PostItem>
          ))}
      </div>
    </div>
  );
};

export default PostReleat;
