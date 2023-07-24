import Link from "next/link";
import Container from "~/components/containers/Container";
import {
  useNetwork,
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { BigNumber, ethers } from "ethers";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import GasEstimate from "~/components/GasEstimate";
import { clsx } from "clsx";
import * as yup from "yup";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

const stakeAddress = "0x3a6370B6C99a776833540f1eB884417604011a68"
const stakeAbi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"term","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"estimateReward","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"term","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"FREN_BSC","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"MAX_STAKE_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"MIN_STAKE_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"SECONDS_IN_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"SECONDS_IN_HOUR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"activeStakes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"durationDays","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"remainBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakeSel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"startTs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userStakes","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"stakeTs","type":"uint256"},{"internalType":"uint256","name":"stakeTerm","type":"uint256"},{"internalType":"uint256","name":"mrr","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_startTs","type":"uint256"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"setTsAndDura","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rewardBalance","type":"uint256"}],"name":"addReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"term","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const crossTokenABI = [{"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"round","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CrossIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DAYS_IN_YEAR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FIXED_INFLATE_YEAR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GENESIS_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SECONDS_IN_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SECONDS_IN_YEAR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"crossMinter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"genesisTs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"roundClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"roundDistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_merkleRoot","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"crossIn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_merkleRoot","type":"bytes32"},{"internalType":"bytes32","name":"_origin","type":"bytes32"},{"internalType":"uint256","name":"_chainId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes32[]","name":"_proof","type":"bytes32[]"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentQuota","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cmts","type":"uint256"}],"name":"computeQuota","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_merkleRoot","type":"bytes32"},{"internalType":"bytes32","name":"_origin","type":"bytes32"},{"internalType":"uint256","name":"_chainId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes32[]","name":"_proof","type":"bytes32[]"}],"name":"checkHolder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"},{"internalType":"bytes32","name":"_origin","type":"bytes32"},{"internalType":"uint256","name":"_chainId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"leaf","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"}]
const crossTokenAddr = '0xE6A768464B042a6d029394dB1fdeF360Cb60bbEb'

export interface UserStake {
  amount : number;
  stakeTs : number;
  stakeTerm : number;
  mrr : number;
}
const Stake = () => {
  const { t } = useTranslation("common");

  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [userStake, setUserStake] = useState<UserStake>();

  const [allowanceAmount, setAllowanceAmount] = useState(BigNumber.from(0))
  const [aping, setAping] = useState(false)
  const [selTerm, setSelTerm] = useState(0);
  const [startTs, setStartTs] = useState(0);
  const [remainQuota, setRemainQuota] = useState(BigNumber.from(0))

  const { xenBalance, feeData } =
    useContext(XENContext);

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startStakeAmount: yup
        .number()
        .required(t("form-field.amount-required"))
        .max(
          Number(
            ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))
          ),
          t("form-field.amount-maximum", {
            maximumAmount: xenBalance?.formatted,
          })
        )
        .positive(t("form-field.amount-positive"))
        .typeError(t("form-field.amount-required")),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();
  /*** CONTRACT WRITE SETUP ***/

  const { config: _20config, error: _20error } = usePrepareContractWrite({
    addressOrName: crossTokenAddr,
    contractInterface: crossTokenABI,
    functionName: "approve",
    args: [stakeAddress, watchAllFields.startStakeAmount ? ethers.utils.parseEther(watchAllFields.startStakeAmount).toHexString() : 0],
  })
  const { data: approveData, write: approveWrite } = useContractWrite({
    ..._20config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
      setAllowanceAmount(ethers.utils.parseEther(watchAllFields.startStakeAmount))
    },
  });

  const {} = useContractRead({
    addressOrName: crossTokenAddr,
    contractInterface: crossTokenABI,
    functionName: "allowance",
    args: [address, stakeAddress],
    onSuccess(data) {
      setAllowanceAmount(BigNumber.from(data))
    }
  })
  const {} = useContractRead({
    addressOrName: stakeAddress,
    contractInterface: stakeAbi,
    functionName: "startTs",
    args: [],
    onSuccess(data) {
      setStartTs(Number(data))
    }
  })

  const {} = useContractRead({
    addressOrName: stakeAddress,
    contractInterface: stakeAbi,
    functionName: "remainBalance",
    args: [],
    onSuccess(data) {
      setRemainQuota(BigNumber.from(data))
    }
  })

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
      if(data.amount > 0) {
        setDisabled(true)
      }
    }
  })

  const handleChange = (e : any) => {
    setSelTerm(Number(e.target.value))
  }

  const { config } = usePrepareContractWrite({
    addressOrName: stakeAddress,
    contractInterface: stakeAbi,
    functionName: "stake",
    args: [
      selTerm ?? 0,
      ethers.utils.parseUnits((Number(watchAllFields?.startStakeAmount) || 0).toString(), xenBalance?.decimals ?? 0),
    ],
    enabled: !disabled,
    onError(e) {
    }
  });
  const { data: stakeData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: aping ? approveData?.hash : stakeData?.hash,
    onSuccess(data) {
      if(aping) {
        setAping(false);
        handleStakeSubmit(0);
      } else {
        toast(t("toast.claim-successful"));
        router.push("/stake/2");
      }
    },
  });
  const handleStakeSubmit = (data: any) => {
    let crossAmount = ethers.utils.parseEther(watchAllFields.startStakeAmount)
    if(allowanceAmount.gte(crossAmount)) {
      writeStake?.();
    } else {
      setAping(true)
      approveWrite?.()
    }
  };

  /*** USE EFFECT ****/

  useEffect(() => {
    if(!(startTs < Math.floor(new Date().getTime() / 1000))) {
      setDisabled(true)
    } else {
      if (!processing && address && userStake?.stakeTerm == 0) {
        setDisabled(false);
      }
    }
  }, [
    address,
    processing,
    userStake,
    selTerm,
    isValid,
    config,
    startTs,
  ]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">{t("stake.start")}</a>
          </Link>

          <Link href="/stake/2">
            <a className="step">{t("stake.staking")}</a>
          </Link>

          <Link href="/stake/3">
            <a className="step">{t("stake.end")}</a>
          </Link>
        </ul>

        <CardContainer>
          <form onSubmit={handleSubmit(handleStakeSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("stake.start")}</h2>
              <div className="stat-desc text-right">Total Rewards : {7200000000} FREN</div>
              <div className="stat-desc text-right">Remain Rewards : {remainQuota.div(BigNumber.from("1000000000000000000")).toString()} FREN</div>
              
              <MaxValueField
                title={t("form-field.amount").toUpperCase()}
                description={t("form-field.amount-description")}
                value={ethers.utils.formatUnits(
                  xenBalance?.value ?? BigNumber.from(0),
                  xenBalance?.decimals ?? BigNumber.from(0)
                )}
                disabled={disabled}
                errorMessage={
                  <ErrorMessage errors={errors} name="startStakeAmount" />
                }
                register={register("startStakeAmount")}
                setValue={setValue}
              />

              <div className="form-control w-full">
                <label className="label text-neutral">
                  <span className="label-text text-neutral">{"Stake Days"}</span>
                  {/* <span className="label-text-alt text-error">{"Stake Days"}</span> */}
                </label>
                <select className="input input-bordered w-full text-neutral" onChange={(e) => handleChange(e)}>
                    <option value="0">NONE</option>
                    <option value="3">3 days(3%/M)</option>
                    <option value="7">7 days(8%/M)</option>
                    <option value="15">15 days(18%/M)</option>
                    <option value="30">30 days(36%/M)</option>
                </select>
              </div>

              {/* <div className="flex stats glass w-full text-neutral">
                <NumberStatCard
                  title={t("card.yield")}
                  value={stakeYield({
                    xenBalance: watchAllFields.startStakeAmount,
                    genesisTs: genesisTs,
                    term: watchAllFields.startStakeDays,
                    apy: currentAPY,
                  })}
                  decimals={0}
                  description={`${currentAPY.toFixed(2)}%`}
                />
                <DateStatCard
                  title={t("card.maturity")}
                  dateTs={maturity}
                  isPast={false}
                />
              </div> */}

              <div className="alert shadow-lg glass">
                <div>
                  <div>
                    <InformationCircleIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t("stake.terms")}</h3>
                    <div className="text-xs">
                    {"Staking Event is now live! Powered by the FREN development team, this one-month event offers high-reward incentives for all participants. Stay vigilant for the latest updates and seize the opportunity to participate in the thriving FREN ecosystem. We thank you for your continuous support and participation. Let's make the FREN community grow and prosper together!"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-control w-full">
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
                  disabled={disabled}
                >
                  {t("stake.start")}
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
