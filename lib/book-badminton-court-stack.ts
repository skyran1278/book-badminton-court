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
          ARIEL_ACCOUNT: process.env.ARIEL_ACCOUNT || "",
          ARIEL_COURT_1: process.env.ARIEL_COURT_1 || "",
          ARIEL_COURT_2: process.env.ARIEL_COURT_2 || "",
          ARIEL_PASSWORD: process.env.ARIEL_PASSWORD || "",
          ARIEL_SESSION: process.env.ARIEL_SESSION || "",
          ARIEL_TIME_1: process.env.ARIEL_TIME_1 || "",
          ARIEL_TIME_2: process.env.ARIEL_TIME_2 || "",
          PAUL_ACCOUNT: process.env.PAUL_ACCOUNT || "",
          PAUL_COURT_1: process.env.PAUL_COURT_1 || "",
          PAUL_COURT_2: process.env.PAUL_COURT_2 || "",
          PAUL_PASSWORD: process.env.PAUL_PASSWORD || "",
          PAUL_SESSION: process.env.PAUL_SESSION || "",
          PAUL_TIME_1: process.env.PAUL_TIME_1 || "",
          PAUL_TIME_2: process.env.PAUL_TIME_2 || "",
          TZ: process.env.TZ || "",
        },
        timeout: cdk.Duration.seconds(60),
      }
    );

    const lambdaTarget = new LambdaFunction(bookBadmintonCourtLambda);

    new Rule(this, "ScheduleRule", {
      schedule: Schedule.cron({
        minute: "45",
        hour: "8",
        weekDay: "2",
      }),
      // schedule: Schedule.cron({ minute: "59", hour: "15", weekDay: "5" }),
      targets: [lambdaTarget],
    });
  }
}
