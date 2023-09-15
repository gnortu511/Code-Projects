import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    }

    &-title {
      margin-bottom: 12px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    &-image {
      height: 250px;
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  if (!data.id) return null;
  return (
    <PostNewestLargeStyles>
      <PostImage
        url={data?.urlImage}
        alt="unsplash"
        to={data?.slug}
      ></PostImage>
      <PostCategory to={data?.category?.name}>
        {data?.category.name}
      </PostCategory>
      <PostTitle size="big" to={data?.slug}>
        {data?.title}
      </PostTitle>
      <PostMeta
        authorName={data?.user.fullname}
        date={new Date(data.createdAt.seconds * 1000).toLocaleDateString(
          "vi-VI"
        )}
        to={slugify(data.user?.username || "", { lower: true })}
      ></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
