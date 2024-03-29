import * as cdk from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class BookBadmintonCourtStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bookBadmintonCourtLambda = new lambda.Function(
      this,
      "bookBadmintonCourt",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "src/lambda.booking",
        code: lambda.Code.fromAsset(path.join(__dirname, "lambda")),
        environment: {
          NAMES: process.env.NAMES || "",
          SESSIONS: process.env.SESSIONS || "",
          ACCOUNTS: process.env.ACCOUNTS || "",
          PASSWORDS: process.env.PASSWORDS || "",
          LINE_BEARER_TOKEN: process.env.LINE_BEARER_TOKEN || "",
        },
        timeout: cdk.Duration.seconds(80),
      }
    );

    const lambdaTarget = new LambdaFunction(bookBadmintonCourtLambda);

    new Rule(this, "ScheduleRule", {
      // schedule: Schedule.cron({
      //   minute: "22",
      //   hour: "12",
      //   weekDay: "SUN",
      // }),
      schedule: Schedule.cron({ minute: "59", hour: "15", weekDay: "THU" }),
      targets: [lambdaTarget],
    });
  }
}
