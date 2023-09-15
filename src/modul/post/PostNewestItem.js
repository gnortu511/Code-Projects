import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  .post {
    &-image {
      display: block;
      flex-shrink: 0;
      width: 180px;
      height: 130px;
      border-radius: 12px;
    }
    &-category {
      margin-bottom: 8px;
    }

    &-title {
      margin-bottom: 8px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    margin-bottom: 14px;
    padding-bottom: 14px;
    .post {
      &-image {
        width: 140px;
        height: 100px;
      }
    }
  }
`;
const PostNewestItem = ({ data }) => {
  if (!data) return null;
  return (
    <PostNewestItemStyles>
      <PostImage
        url={data?.urlImage}
        to={data?.slug}
        alt="unsplash"
      ></PostImage>

      <div className="post-content">
        <PostCategory type="secondary" to={data?.category.name}>
          {data?.category.name}
        </PostCategory>
        <PostTitle to={data?.slug}>{data?.title}</PostTitle>
        <PostMeta
          authorName={data?.user.fullname}
          date={new Date(data.createdAt.seconds * 1000).toLocaleDateString(
            "vi-VI"
          )}
          to={slugify(data.user?.username || "", { lower: true })}
        ></PostMeta>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;
