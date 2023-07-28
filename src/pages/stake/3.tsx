import Link from "next/link";
import Container from "~/components/containers/Container";
import {
  useNetwork,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import GasEstimate from "~/components/GasEstimate";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

const stakeAddress = "0x3a6370B6C99a776833540f1eB884417604011a68"
const stakeAbi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"term","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"estimateReward","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"term","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"FREN_BSC","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"MAX_STAKE_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"MIN_STAKE_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"SECONDS_IN_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"SECONDS_IN_HOUR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"activeStakes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"durationDays","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"remainBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakeSel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"startTs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userStakes","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"stakeTs","type":"uint256"},{"internalType":"uint256","name":"stakeTerm","type":"uint256"},{"internalType":"uint256","name":"mrr","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_startTs","type":"uint256"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"setTsAndDura","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rewardBalance","type":"uint256"}],"name":"addReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"term","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endStake","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const Stake = () => {
  const { t } = useTranslation("common");

  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [earlyEndStake, setEarlyEndStake] = useState(false);

  const { handleSubmit } = useForm();

  const { feeData } = useContext(XENContext);

  const {} = useContractRead({
    addressOrName: stakeAddress,
    contractInterface: stakeAbi,
    functionName: "userStakes",
    args: [address],
    onSuccess: function(data) {
      if(Number(data.stakeTs) + 24*60*60*Number(data.stakeTerm) > Math.floor(new Date().getTime())) {
        //setEarlyEndStake(true)
        setDisabled(false)
      }
    }
  })

  const { config } = usePrepareContractWrite({
    addressOrName: stakeAddress,
    contractInterface: stakeAbi,
    functionName: "endStake",
    // enabled: (userStake && !userStake.term.isZero()) ?? false,
  });
  const { data: withdrawData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: withdrawData?.hash,
    onSuccess(data) {
      toast(t("toast.end-stake-successful"));
      router.push("/stake/1");
    },
  });
  const handleStakeSubmit = () => {
    writeStake?.();
  };

  useEffect(() => {
    
  }, [address, router, processing]);

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
            <a className="step step-neutral">{t("stake.end")}</a>
          </Link>
        </ul>
        <CardContainer>
          <form onSubmit={handleSubmit(handleStakeSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("stake.end")}</h2>

              {earlyEndStake && (
                <div className="alert shadow-lg glass">
                  <div>
                    <div>
                      <InformationCircleIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold">{t("stake.note")}</h3>
                      <div className="text-xs">
                        {t("stake.note-description")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-control w-full">
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
                  disabled={disabled}
                >
                  {t("stake.end")}
                </button>
              </div>

              <GasEstimate
                feeData={feeData}
                gasLimit={config?.request?.gasLimit}
              />
            </div>
          </form>
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
