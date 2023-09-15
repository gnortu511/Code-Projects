import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;

      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    }

    &-title {
      margin-bottom: 8px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-image {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;

const PostItem = ({ data }) => {
  console.log("data", data);
  if (!data) return null;
  return (
    <PostItemStyles>
      <PostImage
        url={data?.urlImage}
        alt="unsplash"
        to={data?.slug}
      ></PostImage>

      <PostCategory to={data?.category.name}>
        {data?.category.name}
      </PostCategory>
      <PostTitle to={data?.slug}>{data?.title}</PostTitle>
      <PostMeta
        authorName={data?.user.fullname}
        date={new Date(data?.createdAt?.seconds * 1000).toLocaleDateString(
          "vi-VI"
        )}
      ></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;
