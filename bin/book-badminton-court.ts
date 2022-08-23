#!/usr/bin/env node
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { BookBadmintonCourtStack } from "../lib/book-badminton-court-stack";

const app = new cdk.App();
new BookBadmintonCourtStack(app, "BookBadmintonCourtStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: "930008094207", region: "ap-northeast-1" },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
