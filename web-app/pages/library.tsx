import { GetServerSideProps } from 'next';
import React from 'react';

export const getServerSideProps: GetServerSideProps = async (
  context,
) => {
  return {
    props: {
      // props for your component
    },
  };
};

export default function library() {
  return <div></div>;
}
