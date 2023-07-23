import {
  useAccount,
  useContractRead,
} from "wagmi";

import Link from "next/link";
import Container from "~/components/containers/Container";
import { progressDays } from "~/lib/helpers";
import {
  ProgressStatCard,
  NumberStatCard,
  CountdownCard,
} from "~/components/StatCards";
import { useEffect, useState, useContext } from "react";
import Countdown from "react-countdown";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";
import { ethers, BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

const stakeAddress = "0x3a6370B6C99a776833540f1eB884417604011a68"
const stakeAbi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"term","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"estimateReward","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"term","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"FREN_BSC","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"MAX_STAKE_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"MIN_STAKE_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"SECONDS_IN_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"SECONDS_IN_HOUR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"activeStakes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"durationDays","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"remainBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakeSel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"startTs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userStakes","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"stakeTs","type":"uint256"},{"internalType":"uint256","name":"stakeTerm","type":"uint256"},{"internalType":"uint256","name":"mrr","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_startTs","type":"uint256"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"setTsAndDura","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rewardBalance","type":"uint256"}],"name":"addReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"term","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export interface UserStake {
  amount : number;
  stakeTs : number;
  stakeTerm : number;
  mrr : number;
}

const Stake = () => {
  const { t } = useTranslation("common");

  const { address } = useAccount();
  
  const [userStake, setUserStake] = useState<UserStake>();

  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);

  const {} = useContractRead({
    addressOrName: stakeAddress,
    contractInterface: stakeAbi,
    functionName: "userStakes",
    args: [address],
    onSuccess: function(data) {
      setUserStake({
        amount: data.amount,
        stakeTs: data.stakeTs,
        stakeTerm: data.stakeTerm,
        mrr: data.mrr,
      })
    }
  })

  const { xenBalance } =
    useContext(XENContext);

  const mintItems = [
    {
      title: t("card.liquid"),
      value: Number(
        ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))
      ),
      suffix: " FREN",
    },
    {
      title: t("card.staked"),
      value: Number(
        ethers.utils.formatUnits(userStake?.amount ?? BigNumber.from(0))
      ),
      suffix: " FREN",
      tokenDecimals: 2,
    },
    {
      title: "MRR",
      value: userStake?.mrr ?? 0,
      suffix: "%",
    },
    {
      title: t("card.term"),
      value: userStake?.stakeTerm ?? 0,
      suffix: ` ${t("card.days")}`,
      decimals: 0,
    },
  ];

  useEffect(() => {
    if (userStake) {
      const progress = progressDays(
        // userStake.maturityTs.toNumber(),
        userStake.stakeTs + userStake.stakeTerm * 24 * 3600,
        userStake.stakeTerm
      );

      setProgress(progress);
      setPercent((progress / userStake.stakeTerm) * 100);
    }
  }, [progress, userStake, userStake?.stakeTs, userStake?.stakeTerm]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">{t("stake.start")}</a>
          </Link>

          <Link href="/stake/2">
            <a className="step step-neutral">{t("stake.staking")}</a>
          </Link>

          <Link href="/stake/3">
            <a className="step">{t("stake.end")}</a>
          </Link>
        </ul>
        <CardContainer>
          <h2 className="card-title">{t("stake.staking")}</h2>
          <div className="stats stats-vertical bg-transparent text-neutral space-y-4">
            <Countdown
              date={(userStake?.stakeTs ?? 0) * 1000}
              intervalDelay={0}
              renderer={(props) => (
                <CountdownCard
                  days={props.days}
                  hours={props.hours}
                  minutes={props.minutes}
                  seconds={props.seconds}
                />
              )}
            />
            <ProgressStatCard
              title={t("card.progress")}
              percentComplete={percent}
              value={progress}
              max={userStake?.stakeTerm ?? 0}
              daysRemaining={userStake?.stakeTerm ?? 0 - progress}
              dateTs={userStake?.stakeTs ?? 0}
            />
            {mintItems.map((item, index) => (
              <NumberStatCard
                key={index}
                title={item.title}
                value={item.value}
                suffix={item.suffix}
                decimals={item.decimals}
                tokenDecimals={item.tokenDecimals}
              />
            ))}
          </div>
        </CardContainer>
      </div>
    </Container>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Stake;
