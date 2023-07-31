
import Container from "~/components/containers/Container";
import { useNetwork, useAccount } from "wagmi";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { clsx } from "clsx";

import CardContainerWithVerticalTabs from "~/components/containers/CardContainerWithVerticalTabs";
import CardContainer from "~/components/containers/CardContainer";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

import Txbit from '~/lib/trade/txbit';

const api_key = 'aE1Eba3aD5e7cb9db822Ebfb85B3266f'
const api_secret = 'FeAA93c9Ab4f23960Ce097cCbfE9fAaf'
const tb = new Txbit(api_key, api_secret)

const CexGater = () => {
  const { t } = useTranslation("common");

  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [keyOfApiOrChannel, setKeyOfApiOrChannel] = useState('');
  const [secOfApiOrChannel, setSecOfApiOrChannel] = useState('');

  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nowStart, setNowStart] = useState(0);
  const [nowEnd, setNowEnd] = useState(0);

  /*** FORM SETUP ***/

  const {
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(schema),
  });

  const handleChange = (e : any) => {
    
  }
  const watchAllFields = watch();

  const handleInputTokenContract = (e : any) => {
    // setTokenContract(e.target.value)
  }
  /*** CONTRACT WRITE SETUP ***/

  // original coin batch transfer
  
  const handleStakeSubmit = async (data: any) => {
    
  };

  /*** USE EFFECT ****/

  useEffect(() => {
    // tb.getOrderBook().then(v=> {
    //   console.log("获取到结果", v)
    // })
    // tb.getAccountBalance().then(v => {
    //   console.log("账户余额", v)
    // })
    tb.getMyMarketOrders("FREN%2FUSDT").then(v => {
      console.log("获取代币对的交易订单", v)
    })
    // tb.setLimitSellOrder("0.00000142", "5300000", "FREN%2FUSDT").then(v => {
    //   console.log("挂单结果", v)
    // })
    // tb.getAccountOrder("8a8c979d-0965-49a7-bf08-b36e67e182b3").then(v => {
    //   console.log("账户订单结果", v)
    // })

    tb.getMyCurrencyBalances("FREN").then(v=> {
      console.log("fren balance:", v)
    })
    

    if (!processing && address) {
      setDisabled(false);
    }
  }, [address, processing, watchAllFields.startStakeDays, isValid]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <CardContainerWithVerticalTabs>
          <form onSubmit={handleSubmit(handleStakeSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{"Trade - For CEX"}</h2>
              <div className="form-control w-full">
                <label className="label text-neutral">
                  <span className="label-text text-neutral">{"API Key"}</span>
                  <span className="label-text-alt text-error">{""}</span>
                </label>
                <input
                  type="text"
                  placeholder="api key"
                  className="input input-bordered w-full text-neutral"
                  value={keyOfApiOrChannel}
                  onChange={e => handleInputTokenContract(e)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label text-neutral">
                  <span className="label-text text-neutral">{"API Secret"}</span>
                  <span className="label-text-alt text-error">{""}</span>
                </label>
                <input
                  type="text"
                  placeholder="api secret"
                  className="input input-bordered w-full text-neutral"
                  value={secOfApiOrChannel}
                  onChange={e => handleInputTokenContract(e.target.value)}
                />
              </div>
              <div className="form-control w-full">
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
                  disabled={disabled}
                >
                  {"Send"}
                </button>
              </div>
              
            </div>
          </form>
        </CardContainerWithVerticalTabs>

        <CardContainer>
          <h2 className="card-title">{"My Orders"}</h2>
          <div className="text-right">
            <button
                type="button"
                onClick={setCurrentPage.bind(this, currentPage <= 1 ? 1 : (currentPage-1))}
                className="btn btn-xs glass text-neutral ml-2"
            >
                pre
            </button>
            <span className="btn btn-xs glass text-neutral ml-2">{currentPage} / {totalPage}</span>
            <button
                type="button"
                onClick={setCurrentPage.bind(this, currentPage >= totalPage ? totalPage : (currentPage+1))}
                className="btn btn-xs glass text-neutral ml-2"
            >
                next
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="hidden lg:table-cell">Type</th>
                  <th className="hidden lg:table-cell">Amount</th>
                  <th className="hidden lg:table-cell">Price</th>
                  <th className="hidden lg:table-cell">Percent</th>
                  <th className="hidden lg:table-cell text-right">Action</th>
                </tr>
              </thead>
              <tbody>
              
              </tbody>
            </table>
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

export default CexGater;