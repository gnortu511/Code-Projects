// import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "firebase-app/firebase-config";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";

const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 169px;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    &-category {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }
  }

  @media screen and (min-width: 1024px) {
    height: 272px;
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-content {
        padding: 15px;
      }
    }
  }
`;
const PostFeatureItem = ({ data }) => {
  const navigate = useNavigate();
  console.log("data", data);

  // display date
  const date = data.createdAt
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formartDate = new Date(date).toLocaleDateString("vi-VI");
  // console.log("formatDate", formartDate);
  const { category, user } = data;
  console.log("categories", category);
  if (!data || !data.id) return null;
  return (
    <PostFeatureItemStyles>
      <PostImage url={data.urlImage} alt="unsplash"></PostImage>

      <div className="post-overlay"></div>
      <div className="post-content">
        <div className="post-top">
          {category?.name && (
            <PostCategory type="secondary" to={category.name}>
              {category.name}
            </PostCategory>
          )}

          <PostMeta
            authorName={user?.fullname}
            to={slugify(user?.fullname || "", { lower: true })}
            date={formartDate}
          ></PostMeta>
        </div>
        <PostTitle size="big" to={data?.slug}>
          {data.title}
        </PostTitle>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;
