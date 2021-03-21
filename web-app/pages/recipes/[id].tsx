import React from 'react';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (
  context,
) => {
  const { id } = context.query;
  //const res = await fetch("...")
  //const recipe = await resizeBy.json();
  return {
    props: {
      // props for your component
    },
  };
};

export default function Recipe() {
  return <div></div>;
}
