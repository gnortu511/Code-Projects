import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import PostFeatureItem from "../post/PostFeatureItem";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "post");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("hot", "==", true),
      limit(3)
    );
    onSnapshot(queries, (snapShot) => {
      let result = [];
      snapShot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPost(result);
    });
  }, []);
  if (post.length <= 0) return null;
  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Bài viết nổi bật</Heading>
        <div className="grid-layout">
          {post.map((item) => (
            <PostFeatureItem key={item.id} data={item}></PostFeatureItem>
          ))}
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;
