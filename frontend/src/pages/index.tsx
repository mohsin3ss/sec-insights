import React from "react";
import { type InferGetServerSidePropsType } from "next";

import { getAccessToken } from "@auth0/nextjs-auth0";
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { MarketingSection } from "~/components/landing-page/MarketingSection";
import { TitleAndDropdown } from "~/components/landing-page/TitleAndDropdown";

const LandingPage = ({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <TitleAndDropdown accessToken={token || ''} />
      <MarketingSection />
    </>
  );
};
export default withPageAuthRequired(LandingPage);

export async function getServerSideProps(ctx) {
  try {
    const { accessToken } = await getAccessToken(ctx.req, ctx.res);
    return { props: { token: accessToken } };
  } catch (err) {
    return { props: { token: null } };
  }
}
